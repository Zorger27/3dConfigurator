<script>
import infoStore from "@/store/modules/service/infoStore";
import {openGraphMixin} from "@/assets/ogimage/openGraphMixin";

export default {
  name: 'About',
  mixins: [openGraphMixin],
  computed: {
    infoStore() {
      return infoStore;
    },
  },
  data() {
    return {
      tableView: false,
      showMore: false,
    };
  },
  mounted() {
    const mainTitle = 'About this project';
    const title = 'About these 3D Configurators';
    const metaDescription = '3D Configurators';
    const description = 'About these 3D Configurators';
    const imageUrl = 'https://3d-configurator-max.vercel.app/assets/ogimage/bmp/about.jpg';
    const url = 'https://3d-configurator-max.vercel.app/about';

    this.setOpenGraphTags(metaDescription, title, description, imageUrl, url);
    this.setPageTitle(mainTitle);
  },
  methods: {
    changeView() {
      this.tableView = !this.tableView;
    },
  },
  components: {},
}
</script>

<template>
  <div class="about">
    <h1 class="main">
      {{ $t('about.title') }} <i @click="changeView"><span :class="['fa', tableView ? 'fa-list' : 'fa-th']"></span></i>
    </h1>
    <line></line>
    <h2 @click="showMore = !showMore" class="more">{{$t ('about.more01')}}<i style="color: red; margin-left: 0.5rem"
                                                                             class="fas fa-hand-pointer"></i></h2>
    <p v-if="showMore" style="margin: 0">{{$t ('about.more02')}}</p>
    <p v-if="showMore" style="margin: 0">{{$t ('about.more03')}}</p>
    <h3 v-if="showMore" style="color: deeppink; margin: 0.5rem">{{$t ('about.more04')}}</h3>
    <h3 v-if="showMore" style="color: deeppink; margin: 0.5rem">{{$t ('about.more05')}}</h3>
    <line></line>
    <div v-if="tableView" class="table">
      <table>
        <thead>
        <tr>
          <th class="title" colspan="3">{{ $t('about.technologies') }}</th>
        </tr>
        <tr>
          <th>№</th>
          <th>{{ $t('about.name') }}</th>
          <th>{{ $t('about.version') }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="info in infoStore.state.infoStore" :key="info.id">
          <td class="nomer">{{ info.id }}</td>
          <td class="name"><a :href="info.url" title="In more detail..." target="_blank">{{ info.title }}</a></td>
          <td class="version">{{ info.version }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="inner">
      <h1 class="title" style="text-decoration: underline">{{ $t('about.technologies') }}</h1>
      <div v-for="info in infoStore.state.infoStore" :key="info.id" class="prj">
        <a class="block" :href="info.url" title="In more detail..." target="_blank">
          <h3>
            <span style="color: black">{{ info.id }}.</span> <span>{{ info.title }}</span> <span
            style="color: red">{{ info.version ? 'v.' + info.version : info.version }}</span>
          </h3>
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.about {
  flex: 1 0 auto;
  text-align: center;
  background-image: url("@/assets/background/background01.webp");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  h1 {
    font-size: 2.5rem;
    margin: 0.7rem auto;
    color: mediumvioletred;
  }
  .prj{
    display: inline-flex;
    padding: 1rem;
    max-width: 30rem;
    transition: border-color .2s ease-in-out, background-color .2s, box-shadow .2s;
    a {
      text-decoration: none;
      color: inherit;
      background: inherit;
    }
    a:hover {
      background-image: url("@/assets/background/background02.webp");
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      border-color: rebeccapurple;
      box-shadow: 3px 3px 4px mediumpurple;
    }
    h3 {
      margin-bottom: 0;
      margin-top: 0;
      color: #af0661;
    }
    .block {
      font-size: 1.2rem;
      border: 1px solid rgba(112, 111, 111, 0.6);
      border-radius: 5px;
      padding: 1rem;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.7);
      transition: border-color .2s ease-in-out, background-color .2s, box-shadow .2s;
    }
  }

  .table {
    display: inline-flex;
    font-size: 1.8rem;
    //font-weight: bold;
    color: black;
    border: 1px solid rgba(0, 0, 0, 0.3);
    padding: 1rem;
    margin: 1rem auto;
    border-radius: 5px;
    background: inherit;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.7);
    tr, td, th {border: 1px solid #ddd;padding: 0.5rem;word-wrap: normal}
    .nomer {max-width: 70px;}
    .name {
      text-align: left;
      color: deepskyblue;
      width: 400px;
      a {color: inherit;text-decoration: none;}
      a:hover {color: #2e768d;}
    }
    .version {text-align: right;color: deeppink;width: 150px;}
  }
  .title {color: darkgoldenrod;font-size: 2.5rem;}

  .more {
    display: inline-flex;
    color: lightseagreen;
    cursor: pointer;
    border-bottom: 1px solid transparent;
    margin: 0.5rem;
  }

  .more:hover,
  .more:focus {
    border-bottom: 1px solid lightseagreen;
  }
}

@media(max-width: 1020px) {
  .about {
    .title {font-size: 2rem;}
    h1 {font-size: 2.3rem;margin: 0.6rem auto;}

    .prj {
      padding: 0.8rem;
      .block {
        padding: 0.8rem;
        font-size: 1rem;
      }
    }
    .table {
      font-size: 1.6rem;
      padding: 0.8rem;
      margin: 0.5rem auto 0.8rem;
      tr, td, th {padding: 0.4rem;}
    }
  }
}
@media (max-width: 768px) {
  .about {
    .title {font-size: 1.6rem;}
    h1 {font-size: 2rem;margin: 0.5rem auto;}
    .inner {margin-bottom: 0.3rem;}

    .prj {
      padding: 0.6rem;
      .block {
        font-size: 0.8rem;
        padding: 0.6rem;
      }
    }
    .table {
      font-size: 1.4rem;
      padding: 0;
      margin: 0.5rem auto 0.8rem;
      border: none;
      border-radius: unset;
      tr, td, th {padding: 0.3rem;}
    }
  }
}
</style>