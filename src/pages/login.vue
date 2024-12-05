<script setup lang="ts">
import { login } from "@/api/user";
import { router } from "@/plugins/router";
import authV1BottomShape from "@images/svg/auth-v1-bottom-shape.svg?url";
import authV1TopShape from "@images/svg/auth-v1-top-shape.svg?url";
import { ref } from "vue";
import { toast } from "vue3-toastify";

const form = ref({
  username: "",
  password: "",
  remember: false,
});
const loading = ref(false);

const userLogin = async () => {
  try {
    loading.value = true;
    login({
      grant_type: import.meta.env.VITE_APP_GRANT_TYPE,
      client_id: import.meta.env.VITE_APP_CLIENT_ID,
      client_secret: import.meta.env.VITE_APP_CLIENT_SECRET,
      username: form.value.username,
      password: form.value.password,
    }).then((response) => {
      loading.value = false;
      if (response.status == 200) {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        router.replace("/dashboard");
      } else {
        toast.error(response.data.message);
      }
    });
  } catch (error) {
    loading.value = false;
    console.log(error);
  }
};

const isPasswordVisible = ref(false);
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <!-- 👉 Top shape -->
      <VImg
        :src="authV1TopShape"
        class="text-primary auth-v1-top-shape d-none d-sm-block"
      />

      <!-- 👉 Bottom shape -->
      <VImg
        :src="authV1BottomShape"
        class="text-primary auth-v1-bottom-shape d-none d-sm-block"
      />

      <!-- 👉 Auth Card -->
      <VCard
        class="auth-card"
        max-width="460"
        :class="$vuetify.display.smAndUp ? 'pa-6' : 'pa-0'"
      >
        <VCardItem class="justify-center">
          <div class="app-logo-title" />
        </VCardItem>

        <VCardText>
          <h4 class="text-h4 mb-1">Welcome to HelaAgri! 👋🏻</h4>
          <p class="mb-0">Please sign-in to your account and start the adventure</p>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="userLogin">
            <VRow>
              <!-- username -->
              <VCol cols="12">
                <VTextField
                  v-model="form.username"
                  autofocus
                  label="Email or Username"
                  type="email"
                  placeholder="johndoe@email.com"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField
                  v-model="form.password"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'bx-hide' : 'bx-show'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <!-- remember me checkbox -->
                <div class="d-flex align-center justify-space-between flex-wrap my-6">
                  <VCheckbox v-model="form.remember" label="Remember me" />

                  <a class="text-primary" href="javascript:void(0)"> Forgot Password? </a>
                </div>

                <!-- login button -->
                <VBtn block :loading="loading" type="submit"> Login </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
