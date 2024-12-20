<script>
export default {
  name: "Author",
};
</script>

<template>
  <div class="author">
    {{ $t('footer.text1') }}
    <b>
      <a href="https://zorger27.github.io" title="Curriculum VITAE" target="_blank">
        {{ $t('footer.text2') }}
      </a>
    </b>{{ $t('footer.text3') }}
  </div>
</template>

<style lang="scss" scoped>
.author {
  font-size: 1.5rem;
  font-style: italic;
  letter-spacing: 1px;
  color: saddlebrown;

  a {text-decoration: none;}
  a:hover {text-decoration: underline; color: darkblue;}

  @media (max-width: 1020px) {
    font-size: 1.1rem;
  }

  @media (max-width: 768px) {
    letter-spacing: normal;
    font-size: 0.9rem;
  }
}
</style>
