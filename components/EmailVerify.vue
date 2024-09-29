<script setup lang="ts">
    import { sendEmailVerification } from 'firebase/auth'
    const user = useCurrentUser()
    const loading = ref(false)

    async function sendVerification() {
        loading.value = true
        if(user.value)  {
            sendEmailVerification(user.value)
            loading.value = false
            alert(`Email verification successfully sent!`)
        } else {
            alert(`Error: user not logged in!`)
        }
    }
</script>

<template>
    <Message severity="warn" class="w-screen" v-if="user && !user.emailVerified" closable>
        Your email is not verified! Verify it to get the best experience.
        <Button :loading @click="sendVerification()">Send verification link</Button>
    </Message>
</template>