<script>
import {openGraphMixin} from "@/assets/ogimage/openGraphMixin";

export default {
  name: 'PageNotFound',
  mixins: [openGraphMixin],
  mounted() {
    const mainTitle = 'Page NOT Found';
    const title = '3D Configurators - Page NOT Found';
    const metaDescription = '3D Configurators';
    const description = '3D Configurators - Page NOT Found';
    const imageUrl = 'https://3d-configurator-max.vercel.app/assets/ogimage/bmp/image_404.jpg';
    const url = 'https://3d-configurator-max.vercel.app';

    this.setOpenGraphTags(metaDescription, title, description, imageUrl, url);
    this.setPageTitle(mainTitle);
    this.setCanonical(url);
  },
  components: {},
  methods: {},
}
</script>

<template>
  <div class="container">
    <div class="inner">
      <h1>404</h1>
      <p>Page not found, back to main page</p>
      <router-link to="/">Back to MAIN</router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex: 1 0 auto;

  .inner {
    margin: 10rem auto;

    h1 {
      font-size: 7rem;
      letter-spacing: 1rem;
      margin: 2rem;
    }
  }
}

p {
  font-size: 1.2rem;
  padding: 1rem;
}

a {
  font-size: 1.3rem;
  text-decoration: none;
  font-weight: bold;
  color: inherit;
  border: 1px solid rgba(112, 111, 111, 0.6);
  border-radius: 5px;
  padding: 0.8rem;
  box-shadow: 3px 3px 4px 0 lightgrey;
}

a:hover {
  color: darkred;
  border: 1px solid #780485;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.5), rgba(27, 27, 217, 0.3));
  box-shadow: 3px 3px 4px 0 #cc1cc3;
}
</style>