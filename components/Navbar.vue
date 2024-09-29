<script setup lang="ts">
    import { House, Play, Trophy } from 'lucide-vue-next'

    const router = useRouter()
    const user = useCurrentUser()

    const items = ref([
        {
            label: `Home`,
            route: `/`,
            icon: House
        },
        {
            label: `Play`,
            route: `/play`,
            icon: Play
        },
        {
            label: `Leaderboard`,
            route: `/leaderboard`,
            icon: Trophy
        }
    ])
</script>

<template>
    <div class="flex gap-4 items-center p-6 bg-zinc-100 dark:bg-zinc-900">
        <div>
            <RouterLink to="/" class="text-3xl">Lorem Ipsum</RouterLink>
        </div>
        <ul class="flex gap-4">
            <li v-for="item in items">
                <Button severity="secondary" text @click="router.push(item.route)"><component :is="item.icon" />{{ item.label }}</Button>
            </li>
        </ul>
        <div class="absolute right-0 top-4">
            <Button v-if="!user" severity="secondary">Sign up/Log in</Button>
        </div>
    </div> 
</template>