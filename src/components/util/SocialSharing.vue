<script>
export default {
  name: 'SocialSharing',
  methods: {
    shareOnFacebook() {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    },
    tweetOnExTwitter() {
      const text = encodeURIComponent('Check out this awesome page!😉👍');
      const url = encodeURIComponent(window.location.href);
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    },
    shareOnLinkedIn() {
      const url = encodeURIComponent(window.location.href);
      // Создаем URL для использования LinkedIn Share API
      const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
      // Открываем окно шаринга с использованием LinkedIn Share API
      window.open(shareUrl, '_blank', 'width=600,height=400,resizable=yes,scrollbars=yes,status=yes');
    },
    shareLink() {
      const url = window.location.href;
      const decodedUrl = decodeURIComponent(url);

      navigator.clipboard.writeText(decodedUrl).then(() => {
        console.log('Link copied to clipboard');
      }).catch((error) => {
        console.error('Error copying link to clipboard:', error);
      });
    },
  },
};
</script>

<template>
  <div class="social-sharing">
    <i class="fab fa-facebook" @click="shareOnFacebook" title="Share on Facebook"></i>
    <i class="fab fa-x-twitter" @click="tweetOnExTwitter" title="Tweet this Page"></i>
    <i class="fab fa-linkedin" @click="shareOnLinkedIn" title="Share on LinkedIn"></i>
    <i class="fas fa-link" @click="shareLink" title="Share this Page"></i>
  </div>
</template>

<style scoped lang="scss">
.social-sharing {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto;
  grid-auto-flow: column;
  grid-template-areas: "facebook twitter linkedin link";
  font-size: 2rem;
  margin-left: 0.5rem;
  //border: 1px black solid;
  .fa-facebook {grid-area: facebook;}
  .fa-x-twitter {grid-area: twitter;}
  .fa-linkedin {grid-area: linkedin;}
  .fa-link {grid-area: link;}

  i {
    padding: 0 0.5rem;
    cursor: pointer;
    color: darkblue;
    text-shadow: 2px 2px 4px white;
  }
  i:hover {color: mediumvioletred;}
  i:active {color: darkgoldenrod;}

}
@media (max-width: 1020px) {
  .social-sharing {
    i {
      font-size: 1.7rem;
      padding: 0 0.4rem;
    }
  }
}
@media (max-width: 768px) {
  .social-sharing {
    grid-template-columns: 1fr 1fr;
    grid-gap: 0.3rem;
    grid-template-areas:
      "facebook twitter"
      "linkedin link";

    i {
      font-size: 1.7rem;
      padding: 0 0.3rem;
    }
  }
}


</style>