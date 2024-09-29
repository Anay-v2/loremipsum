<script setup lang="ts">
    import { Mail, KeyRound, AtSign, PersonStanding, User } from 'lucide-vue-next'
    import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from 'firebase/auth'
    import { get, set, update, ref as fref } from 'firebase/database'
    import { useFirebaseAuth } from 'vuefire'

    definePageMeta({
        layout: false
    })

    // Route
    const route = useRoute()
    const router = useRouter()

    // Sign in/up
    const provider = new GoogleAuthProvider()
    const auth = useFirebaseAuth()
    const db = useDatabase()
    const email = ref(``)
    const password = ref(``)
    
    async function emailSignUp() {
        if(!auth) return
        loading.signup = true
        try {
            await createUserWithEmailAndPassword(auth, email.value, password.value)
            await storeUserInDB()
            add.value = true
        }
        catch(e) {
            window.alert(`Error: ${e}`)
        } finally {
            loading.signup = false
        }
    }
    
    async function emailLogIn() {
        if(!auth) return
        loading.login = true
        try {
            await signInWithEmailAndPassword(auth, email.value, password.value)
            router.push(`/`)
        }
        catch(e) {
            window.alert(`Error: ${e}`)
        } finally {
            loading.login = false
        }
    }
    
    async function google() {
        if(!auth) return
        loading.google = true
        try {
            await signInWithPopup(auth, provider)
            const n = await isNewUser()
            if(n) {
                await storeUserInDB()
                add.value = true
            } else {
                router.push(`/`)
            }
        } catch(e) {
            window.alert(`Error: ${e}`)
        } finally {
            loading.google = false
        }
    }
    
    async function storeUserInDB(add: boolean = false, addInfo?: { handle: string, username: string }) {
        if(!db || !auth || !auth.currentUser) throw new Error()
        const user = auth.currentUser
        if(!add) {
            await set(fref(db, `users/${user.uid}`), {
                pic: user.photoURL || ``,
                created: new Date().getUTCMilliseconds(),
                add
            })
        } else {
            await update(fref(db, `users/${user.uid}`), {
                add: true,
                ...addInfo
            })
        }
        return
    }

    async function isNewUser() {
        if(!db || !auth || !auth.currentUser) throw new Error()
        const user = auth.currentUser
        const snap =  await get(fref(db, `/users/${user.uid}`))
        return !snap.exists()
    }

    // Additional Info

    const username = ref(``)
    const handle = ref(``)
    const add = ref(route.query.add ? true : false)
    async function checkAvailable(user: boolean = false) {
        loading.checkava = user
        const users = await get(fref(db, `users`))
        const userVal = await users.val()
        if(handle.value.length === 0 || handle.value.includes('@') || handle.value.match(/\s/)) {
            if(user) alert(`Invalid handle! It cannot be empty, contain @ or any spaces!`)            
            return false
        }
        const available = userVal ? !(Object.values(userVal).find((v: any) => v.handle && v.handle === handle.value)) : true
        if(user) {
            alert(available ? `Handle available!` : `Handle not available!`)
        }
        loading.checkava = false
        return available
    }
    
    async function addInfo() {
        loading.addinfo = true
        const available = await checkAvailable()
        if(!available) {
            alert(`Handle not available!`)
            loading.addinfo = false
            return
        }
        if(username.value.length === 0) {
            alert(`Empty username!`)
            loading.addinfo = false
            return
        }
        if(handle.value.length === 0) {
            alert(`Empty handle!`)
            loading.addinfo = false
            return
        }
        if(username.value.length > 20) {
            alert(`Username can't be more than 20 characters long!`)
            loading.addinfo = false
            return
        }
        if(handle.value.length > 15) {
            alert(`Handle can't be more than 15 characters long!`)
            loading.addinfo = false
            return
        }
        if(handle.value.match(/[^a-zA-Z0-9_-]/g)) {
            alert(`Handle can only have alphabets, numbers, _ and - !`)
            loading.addinfo = false
            return
        }
        await storeUserInDB(true, {
            handle: handle.value,
            username: username.value
        })
        const user = useCurrentUser()
        if(user.value) {
            await sendEmailVerification(user.value)
            add.value = false
            verify.value = true
        }
    }

    // Other
    const verify = ref(false)
    const loading = reactive({
        signup: false,
        login: false,
        google: false,
        checkava: false,
        addinfo: false,
    })
</script>
<template>
    <div class="grid place-items-center w-screen h-screen">
        <Card class="w-screen lg:w-[40%] min-h-[80%] text-center">
            <template #title>
                <h1 class="text-4xl">Login or Sign Up</h1>
            </template>
            <template #content>
                <div v-if="!add && !verify">
                    <div class="mt-5"></div>
                    <InputGroup class="my-10">
                        <InputGroupAddon><Mail /></InputGroupAddon>
                        <InputText type="email" v-model="email" placeholder="Enter your email" />
                    </InputGroup>
                    <InputGroup class="my-10">
                        <InputGroupAddon><KeyRound /></InputGroupAddon>
                        <InputText type="password" v-model="password" placeholder="Enter your password" />
                    </InputGroup>
                </div>
                <div v-if="add && !verify">
                    <h2 class="my-10 text-xl">Let's get to know more about you</h2>
                    <InputGroup class="my-10">
                        <InputGroupAddon><User /></InputGroupAddon>
                        <InputText type="text" v-model="username" placeholder="Enter your username" />
                    </InputGroup>
                    <InputGroup class="mt-10">
                        <InputGroupAddon><AtSign /></InputGroupAddon>
                        <InputText type="text" v-model="handle" placeholder="Enter your handle" />
                    </InputGroup>
                    <Button class="mt-2 mb-10" label="Check Availability" severity="info" @click="checkAvailable(true)" :loading="loading.checkava" />
                </div>
                <div v-if="verify" class="text-center">
                    <h2 class="my-10 text-xl">Your account has been created!</h2>
                    Verify your email to get the best experience. Note that if you signed in with google you don't need to do this.
                </div>
            </template>
            <template #footer>
                <div v-if="!verify && !add">
                    <Button class="my-2 w-full" label="Sign Up" @click="emailSignUp()" :loading="loading.signup" />
                    <Button class="my-2 w-full" label="Log In" severity="secondary" @click="emailLogIn()" :loading="loading.login" />
                    <Button class="w-full my-2 !bg-white focus:!bg-white hover:!bg-white !ring-none focus:!ring-none !text-slate-900" @click="google()" :loading="loading.google">
                        <img src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" class="w-8 h-8" />
                        Sign in with Google
                    </Button>
                </div>
                <div v-if="!add">
                    <Button class="my-2 w-full" label="Back to Home" severity="contrast" @click="router.push(`/`)" />
                </div>
                <div v-if="add">
                    <Button class="my-2 w-full" label="Proceed" @click="addInfo()" :loading="loading.addinfo" />
                </div>
            </template>
        </Card>
    </div>
</template>