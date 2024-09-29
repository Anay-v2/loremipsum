<script setup lang="ts">
    import { ref as fref } from 'firebase/database'

    const db = useDatabase()

    const scoresref = useDatabaseList(fref(db, `/scores`))
    const leaderboard = computed(() => {
        const arr = Object.values(scoresref.data.value)
        arr.forEach((v: any) => {
            console.log(v)
            if(v.date) v.date = new Date(v.date).toUTCString()
            // if(v.accuracy) v.accuracy = v.accuracy.toFixed(2)
            // if(v.time) v.time = v.time.toFixed(2)
        })
        //@ts-ignore
        return arr.sort((a: any,b: any) => {
            if(!a.accuracy || !a.time || !b.accuracy || !b.time) return 1
            if(a.accuracy >= 75 && b.accuracy >= 75) {
                return a.time - b.time
            } else {
                return a.accuracy - b.accuracy
            }
        })
    })
</script>

<template>
    <Navbar />
    <EmailVerify />
    <h1 class="mt-2 mb-10 text-5xl">Leaderboard</h1>
    <DataTable :value="leaderboard" tableStyle="width: 100vw; height: 100%;" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
        <Column field="name" header="Name" style="width: 25vw" />
        <Column field="accuracy" header="Accuracy" style="width: 25vw" />
        <Column field="time" header="Time" style="width: 25vw" />
        <Column field="date" header="Date" style="width: 25vw" />
    </DataTable>
</template>