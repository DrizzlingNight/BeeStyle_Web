<template>
  <div>
    <span class="nft-name">{{ item.token.name }}</span>
  </div>
</template>

<script>
export default {
  name: "SimpleNftShow",
  props: ['item'],
}
</script>

<style scoped>
.nft-name {
  display: block;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
}
</style>
