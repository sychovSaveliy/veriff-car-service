<template>
    <div>
        Order
    </div>
</template>

<script>
    export default {
        created(){
            console.log(this.$router.history.current.name)
        }
    }
</script>

<style lang="scss" scoped>

</style>