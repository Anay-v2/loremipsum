<script setup lang="ts">
    import { Play, Save } from 'lucide-vue-next'
    import { get, set, ref as fref } from 'firebase/database'
    
    const user = useCurrentUser()
    const db = useDatabase()
    const started = ref(false)
    const startedDate = ref(Date.now())
    const finished = ref(false)
    const finishedDate: Ref<number | null> = ref(null)
    const userData = ref(``)
    const { data } = await useFetch('https://loripsum.net/api/1/short/')
    const parsedData = ref(``)
    const id = ref(``)
    onMounted(() => {
        id.value = Math.random().toString(36).slice(2)
    })
    const timeElapsed = computed(() => {
        if(!startedDate.value || !finishedDate.value) return 0
        return (finishedDate.value - startedDate.value)/1000
    })
    const loading = ref(true)

    async function start() {
        data.value = parseResponse(data.value as string)
        parsedData.value = data.value as string
        started.value = true
    }

    const parseResponse = (r: string) => r.replaceAll(/<\/?[^>]+>/g, '').trim()

    function compareText() {
        const a = userData.value
        const b = data.value as string
        if(a.length >= b.length) {
            finished.value = true
            finishedDate.value = Date.now()
            return
        }
        let r = ``
        for(let i = 0; i < b.length; i++) {
            if(a[i] === b[i]) {
                r += `<span class="text-slate-900 dark:text-slate-100">${b[i]}</span>`
            } else if(a[i]) {
                r += `<span class="text-red-500 dark:text-red-400">${a[i]}</span>`
            } else if(b[i] && i < a.length) {
                r += `<span class="text-red-500 dark:text-red-400">${b[i]}</span>`
            } else {
                if(i === a.length && b[i] === ` `) userData.value += ` `
                if(i === a.length) r+=`<span class="underline text-slate-400 dark:text-slate-600 decoration-emerald-400 dark:decoration-emerald-600">${b[i]}</span>`
                else r += `<span class="text-slate-400 dark:text-slate-600">${b[i]}</span>`
            }
        }
        parsedData.value = r
    }

    const stats = computed(() => [
        {
            label: `Time taken`,
            val: timeElapsed.value.toFixed(2) + `s`
        },
        {
            label: `Accuracy`,
            val: getAccuracy().toFixed(2) + `%`
        }
    ])

    function getAccuracy() {
        const a = userData.value
        const b = data.value as string
        console.log(a.length, b.length)
        let diff = 0;
        const maxLength = Math.max(a.length, b.length);
        for (let i = 0; i < maxLength; i++) {
            if (a[i] !== b[i]) {
            diff++;
            }
        }
        console.log(diff)
        return ((b.length-diff)/(b.length)) * 100
    }

    async function storeInDb() {
        const dbUser = user.value ? (await get(fref(db, `/users/${user.value?.uid}`))).val() : null
        const name = dbUser && dbUser.username ? dbUser.username : `Guest`
        await set(fref(db, `/scores/${id.value}`), {
            name,
            time: parseFloat(timeElapsed.value.toFixed(2)),
            accuracy: parseFloat(getAccuracy().toFixed(2)),
            date: Date.now()
        })
    }

    onMounted(() => {
        let x = setInterval(() => {
            console.log(data.value)
            if(data.value) loading.value = false; clearInterval(x)
        }, 500)
    })
</script>

<template>
    <Navbar v-if="!started || finished" />
    <EmailVerify v-if="!started || finished" />
    <div class="flex flex-col items-center mt-12 mb-6 w-screen h-screen text-center">
        <Message severity="info" closable class="my-2" v-if="!user && !started">
            If you are not signed in, you won't be able to save your scores!
        </Message>
        <Message severity="info" closable class="my-2" v-if="user && !user.emailVerified && !started">
            If your email is not verified, you won't be able to save your scores!
        </Message>
        <h1 class="text-5xl" v-if="!started || finished">Play</h1>
        <Button @click="start" v-if="!started" :loading size="large" class="mt-5"><Play />Start Game!</Button>
        <h3 class="text-xl" v-if="finished">Reload to play again!</h3>
        <!-- <TextArea autoResize v-model="userData" :placeholder="data"  /> -->
        <div class="flex justify-center items-center" v-if="started && !finished">
            <div class="relative z-0">
                <p class="w-[75vw] text-2xl" style="font-family: 'Roboto Mono', monospace;">
                    <span v-html="parsedData"></span>
                </p>
                <div class="flex absolute inset-0 z-10 min-h-[20vh]" v-if="!finished">
                    <TextArea unstyled autoResize class="w-[75vw] min-h-[20vh] opacity-0" v-model="userData" @input="compareText()" />
                </div>
            </div>
        </div>
        <div class="flex my-5" v-if="finished">
            <div class="flex" v-for="stat in stats">
                <Card>
                    <template #title>
                        <div class="text-5xl text-emerald-800 dark:text-emerald-200">
                            {{ stat.val }}
                        </div>
                    </template>
                    <template #content>
                        <span class="text-xl">{{ stat.label }}</span>
                    </template>
                </Card>
                <Divider layout="vertical" />
            </div>
        </div>
        <Button class="my-2" v-if="finished" @click="storeInDb()"><Save />Save to Leaderboard</Button>
    </div>
</template>