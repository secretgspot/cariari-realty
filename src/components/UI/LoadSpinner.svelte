<script>

</script>

<style lang='scss'>
	.loading {
		display: flex;
		justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
		//margin: 2rem;
	}

  .lds-dual-ring {
    display: inline-block;
    width: 135px;
    height: 142px;
  }
  .lds-dual-ring:after {
    content: " ";
    display: block;
    width: 130px;
    height: 130px;
    border-radius: 50%;
    border: 6px solid var(--color-black);
    border-color: var(--color-black) transparent var(--color-black) transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }
  @keyframes lds-dual-ring {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>

<div class="loading">
	<div class="lds-dual-ring"></div>
</div>