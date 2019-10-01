<script>
	import Toggle from '../UI/Toggle.svelte';

	export let filter = {
		rent: 10000,
		price: 10000000,
		beds: 99,
		baths: 99,
		rooms: 99,
		filter_for: ['Rent','Sale', 'Investment'],
		active: true,
		msl: '',
	};

</script>

<style>
	fieldset {
		/* background: rgba(255, 255, 255, 0.18); */
		border: 0;
		/* color: white; */
		/* display: inline-block; */
		padding: 2rem;
		margin: 0;
		/* width: 300px; */
		position: sticky;
  	top: 0px;
	}
	.row {
		display: flex;
		justify-content: space-between;
		margin: 1rem 0;
	}
	.row label {
		margin: 1rem;
	}
	label small {
		text-transform: uppercase;
		font-size: 70%;
	}
	.row input { width: 60px; }
	.column {
		display: flex;
		flex-direction: column;
		align-items: stretch;
  	text-align: center;
		margin: 1rem 0;
	}

	.range { margin-bottom: 2rem; }
	.range input { margin: 0; }

	.checkbox { text-align: center; }
</style>

<fieldset>
	<div class="row">
		<label class="checkbox">
			<input type="checkbox" bind:group="{filter.filter_for}" value="Rent" />
			<span>Rent</span>
		</label>

		<label class="checkbox">
			<input type="checkbox" bind:group="{filter.filter_for}" value="Sale" />
			<span>Sale</span>
		</label>

		<label class="checkbox">
			<input type="checkbox" bind:group="{filter.filter_for}" value="Investment" />
			<span>Investment</span>
		</label>
	</div>

	<label class="column range">
		{filter.rent} <input type="range" min="100" max="10000" step="100" bind:value="{filter.rent}"/> <small>monthly</small>
	</label>

	<label class="column range">
		{filter.price} <input type="range" min="10000" max="10000000" step="10000" bind:value="{filter.price}"/> <small>price</small>
	</label>

	<div class="row">
		<label>
			beds <input type="number" min="0" bind:value={filter.beds}/>
		</label>

		<label>
			baths <input type="number" min="0" bind:value={filter.baths}/>
		</label>

		<label>
			rooms <input type="number" min="0" bind:value={filter.rooms}/>
		</label>
	</div>

	<div class="row">
		<label>
			msl <input type="text" bind:value="{filter.msl}" />
		</label>
	</div>

	<div class="row">
		<Toggle bind:checked="{filter.active}" label="{filter.active ? 'Listed' : 'Delisted'}" />

		<!-- <label class="checkbox">
			<input type="checkbox" bind:checked="{filter.active}" />
			<span>Active</span>
		</label> -->
	</div>
</fieldset>

