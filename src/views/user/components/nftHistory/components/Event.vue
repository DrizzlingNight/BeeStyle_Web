<template>
  <div class="d-flex">
    <v-icon x-small>mdi-{{icon[eventId]}}</v-icon>
    <span class="pl-1 align-self-center" style="white-space: nowrap;">{{ $t(`persetting.history.eventItem.${text[eventId]}`) }}</span>
  </div>
</template>

<script>
export default {
  name: "Event",
  props:[
      'eventId'
  ],
  data:()=>({
    icon:[
        null,
        "folder-plus",
        "arrow-top-right-thick",
        "cart-arrow-down",
        "cart-off",
        "hand-back-left-outline",
        "gavel",
        "cart-arrow-right",
        "keyboard-return",
        "scissors-cutting",
        "hand-back-left-off-outline",
        "archive-arrow-up-outline"
    ],
    text:[
        null,
      "create",
      "deliver",
      "onSale",
      "cancelSale",
      "makeOffer",
      "bid",
      "bought",
      "redeem",
      "destroy",
      "cancelOffer",
      "withdraw"
    ]
  })
}
</script>

<style scoped>

</style>
