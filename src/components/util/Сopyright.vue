<script>
export default {
  name: "Copyright",
  props: {
    currentYear: {
      type: Number,
      required: true,
    },
    progYear: {
      type: Number,
      default: null,
    },
  },
  computed: {
    displayYear() {
      return this.progYear && this.progYear !== this.currentYear
        ? `${this.progYear}―${this.currentYear}`
        : `${this.currentYear}`;
    },
  },
};
</script>

<template>
  <div class="copyright">
    <b>&copy; {{ displayYear }}</b> - {{ $t('footer.text4') }}
  </div>
</template>

<style lang="scss" scoped>
.copyright {
  font-size: 1.5rem;
  font-style: italic;
  letter-spacing: 1px;
  color: saddlebrown;
  padding-left: 0.3rem;

  @media (max-width: 1020px) {
    font-size: 1.1rem;
  }

  @media (max-width: 768px) {
    letter-spacing: normal;
    padding-left: 0;
    font-size: 0.65rem;
  }
}
</style>
