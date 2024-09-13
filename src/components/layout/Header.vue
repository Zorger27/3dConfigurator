<script>
// import Vue from "vue";
import LanguageSwitcher from "@/components/util/LanguageSwitcher.vue";
import Header3DLogo2 from "@/components/other/Header3DLogo2.vue";

export default {
  name: 'Header',
  components: {
    Header3DLogo2,
    LanguageSwitcher
  },
  data() {
    return {
      // getHeaderLogoImage: require('@/assets/img/header-logo.svg'),
      showMenu: false,
    };
  },
  methods: {
    hideMenu() {
      this.showMenu = false;
    },
    clickOutsideHandler(event) {
      if (this.showMenu && !(event.target instanceof HTMLElement && event.target.closest(".burger-menu"))) {
        this.showMenu = false;
      }
    },
    about() {
      this.$router.push('/about');
    },
  },
  mounted() {
    document.addEventListener("click", this.clickOutsideHandler);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.clickOutsideHandler);
  },
};
</script>

<template>
  <header>
    <div class="header-logo">
      <div class="burger-menu" @click="showMenu = !showMenu">
        <i :class="['fa', showMenu ? 'fa-times' : 'fa-bars', 'burger-menu-icon']"></i>
      </div>
      <div class="logo" @click="about">
<!--        <img :src="getHeaderLogoImage" alt="Header Logo Image">-->
        <Header3DLogo2 class="img"></Header3DLogo2>
<!--        <Header3DLogo3 class="img"></Header3DLogo3>-->
      </div>
      <language-switcher class="language"></language-switcher>
    </div>
    <div class="menu" :class="{ 'is-active': showMenu }">
      <router-link to="/" @click="hideMenu">{{ $t('header.prg01') }}</router-link>
      <router-link to="/project2" @click="hideMenu">{{ $t('header.prg02') }}</router-link>
      <router-link to="/project3" @click="hideMenu">{{ $t('header.prg03') }}</router-link>
      <router-link to="/about" @click="hideMenu">{{ $t('header.about') }}</router-link>
    </div>
  </header>
</template>

<style lang="scss" scoped>
header {
  height: auto;
  padding: 0;
  display: flex;
  position: relative;
  justify-content: space-between;
  background-image: radial-gradient(at 0% 100%, hsla(189, 100%, 56%, 1) 0px, transparent 50%),
  radial-gradient(at 0% 0%, hsla(242, 100%, 70%, 1) 0px, transparent 50%),
  radial-gradient(at 80% 0%, hsla(28, 100%, 74%, 1) 0px, transparent 50%),
  radial-gradient(at 79% 100%, hsla(343, 100%, 76%, 1) 0px, transparent 50%),
  radial-gradient(at 50% 50%, hsla(355, 100%, 93%, 1) 0px, transparent 50%);

  .burger-menu {
    grid-area: burger-menu;
    display: none;
  }

  .header-logo {
    margin: 0.3rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    grid-row-gap: 0;
    grid-auto-flow: column;
    grid-template-areas: "logo language";

    .logo {
      grid-area: logo;
      align-items: center;
      align-self: center;
      justify-content: center;
      display: flex;
      .img {
          width: 4rem;
          height: 4rem;
          cursor: pointer;
      }
    }

    .language {
      grid-area: language;
      margin-left: 0.5rem;
      align-self: center;
      justify-self: left;
      padding: 0.5rem;
      color: darkblue;
      border: 1px solid transparent;
      font-weight: bold;
      font-size: medium;
      outline: 0 !important;
      appearance: none;
      cursor: pointer;
    }

    .language:hover {
      color: red;
      cursor: pointer;
    }

    @media (max-width: 768px) {
      display: grid;
      grid-template-columns: 1fr 1fr 5fr;
      grid-template-rows: auto;
      grid-template-areas: "burger-menu language logo";
      grid-column-gap: 0.5rem;
      grid-row-gap: 0;
      grid-auto-flow: column;
      padding-right: 0;
      margin-right: 0.5rem;

      .burger-menu {
        display: grid;
        grid-area: burger-menu;
        background-color: inherit;
        align-self: center;
        justify-self: left;
        padding: 0.1rem 0.5rem 0.2rem 0.5rem;
        cursor: pointer;

        .burger-menu-icon {
          color: darkblue;
          background-color: inherit;
          text-shadow: 2px 2px 4px white;
          font-size: 2.5rem;
        }
      }
      .burger-menu:hover {
        background-color: inherit;

        .burger-menu-icon {
          color: red;
        }
      }
      .language {
        align-self: center;
        justify-self: right;
        border: 1px solid transparent;
        border-radius: 5px;
        font-weight: bold;
        font-size: medium;
        outline: 0 !important;
        appearance: none;
      }

      .logo {
        grid-area: logo;
        justify-self: right;
      }
    }
  }
  .menu {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
    margin: 10px;
    @media (max-width: 768px) {
      display: none;
      position: absolute;
      flex-direction: column;
      align-items: start;
      width: max-content;
      top: 90%;
      left: 0;
      //right: 0;
      margin-top: 0.5rem;
      padding: 0.6rem 1rem;
      background-color: #f1f1f1;
      box-shadow: 3px 3px 4px 0 rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(59, 58, 58, 0.9);
      border-radius: 5px;
      text-decoration: none;
      &.is-active {
        display: flex;
        text-decoration: none;
        z-index: 1;

        a {
          border: none;
        }

        a::after {
          /* Удаляем подчёркивание и другие стили для ссылок */
          content: none;
          background-color: transparent;
          border-radius: 0;
          transform: scaleX(1);
        }

        a:hover {
          border: none;
          text-decoration: underline;
          box-shadow: none;
        }

        a:focus {
          box-shadow: none;
          border: none;
          text-decoration: none;
        }
      }
    }

    a {
      border: 2px solid transparent;
      margin-right: 10px;
      font-size: 1.5rem;
      font-weight: bold;
      position: relative;
      text-decoration: none;
      padding: 5px;
      color: darkblue;
      @media(max-width: 1020px) {
        font-size: 1.1rem;
      }
    }

    a::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 2px; /* Высота подчёркивания */
      background-color: rgba(112, 111, 111, 0.9);
      border-radius: 5px; /* Закругленные края подчёркивания */
      transform: scaleX(0); /* Начнём с нулевой ширины */
      transform-origin: center bottom;
      transition: transform 0.3s ease; /* Плавное появление при наведении */
    }

    a:hover::after {
      transform: scaleX(1); /* Увеличим ширину при наведении */
    }

    a:hover {
      color: darkcyan;
    }

    a:focus {
      color: darkred;
    }

    .fa {
      margin-left: 0.3rem;
      margin-top: 0.2rem;
      font-weight: bold;
      text-shadow: 2px 2px 4px white;
      color: red;
    }
  }
}
</style>
