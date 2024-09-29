<script setup lang="ts">
    import { Play, MoveRight } from 'lucide-vue-next'

    const router = useRouter()

    // Subheading Logic
    const subheadings = [
        `Test your typing speeds!`,
        `Race your friends!`,
        `Compete on leaderboards!`,
        `How fast can you type?`,
        `Beat the clock!`,
        `Test your accuracy and speed!`,
        `Challenge yourself with every keystroke!`,
        `Compete with the world!`,
        `Climb the leaderboard ranks!`,
        `Show off your typing skills!`,
        `Connect with other typists!`,
        `Level up your typing game!`,
        `Unlock new challenges!`,
        `Earn rewards for your speed and accuracy!`,
        `Become a typing master!`,
        `Improve your typing skills for school!`,
        `Boost your productivity!`,
        `Train your reflexes!`,
        `Challenge your friends and family!`,
    ];
    const currentSubheading = ref(``)
    function generateRandomHeading() {
        currentSubheading.value = subheadings[Math.floor(Math.random()*subheadings.length)]
    }
    onMounted(() => {
        generateRandomHeading()
        setInterval(generateRandomHeading, 3000)
    })
</script>

<template>
    <EmailVerify />
    <Navbar />
    <div class="grid justify-center w-screen h-screen">
        <div class="grid place-items-center py-10 w-screen text-center" style="background-size: cover;background-image: url(https://img.freepik.com/free-photo/stationery-arrangement-yellow-background_23-2148279752.jpg?size=626&ext=jpg)">
            <div>
                <div>
                    <h1 class="text-5xl text-slate-900">Lorem Ipsum</h1>
                    <h2 class="text-2xl text-slate-700">{{ currentSubheading }}</h2>
                </div>
                <div class="flex gap-4 justify-center items-center mt-20">
                    <Button class="flex gap-2" @click="router.push(`/auth`)">Get Started <MoveRight /></Button>
                    <Button class="flex gap-2" severity="secondary" @click="router.push(`/play`)">Play offline <Play /></Button>
                </div>
            </div>
        </div>
    </div>
    <div class="grid justify-center w-screen h-screen">
        <div class="grid justify-center py-10 w-screen text-center">
            <h1 class="text-5xl text-slate-900">Our Features</h1>
            <div class="flex gap-4 justify-center items-center mt-20">
                <Card v-for="card in [
                    {title: `Test your typing speed`, description: `With our world-class typing practice suite, indulge in the finest typing experience ever.`},
                    {title: `Compete in the Leaderboards`, description: `With an .`},
                ]">
                    <template #title>{{ card.title }}</template>
                    <template #content>
                        <p class="m-0">
                            {{ card.description }}
                        </p>
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>