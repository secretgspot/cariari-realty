<script>
	import Toggle from '../UI/Toggle.svelte';

	export let filter = {
		rent: 10000,
		price: 10000000,
		beds: 99,
		baths: 99,
		rooms: 99,
		filter_type: "Residential",
		filter_for: ['Rent','Sale','Investment'],
		active: true,
		msl: '',
	};

</script>

<style>
	/* .filters {} */
	.filters h3 {
		margin-bottom: 0.5rem;
		color: var(--color-dark);
		font-weight: normal;
	}

	.row { display: flex; justify-content: space-between; }
	.column { display: flex; flex-direction: column; }

	input[type="text"],
	input[type="number"],
	select {
		display: block;
		padding: 0.5rem 0.75rem;
		font-size: 1rem;
		line-height: 1.25;
		color: #55595c;
		border: 1px solid rgba(0, 0, 0, 0.15);
		border-radius: 0.25rem;
		width: -webkit-fill-available;
		box-shadow: inset 0 2px 4px 0 hsla(0, 0%, 0%, 0.09);
		background: var(--color-light);
	}
	input[type="text"],
	input[type="number"] { max-width: 81px; }

	.property_type {
		padding: 2rem;
		box-shadow: 0 1px 0px var(--color-dark),
								0 2px 0px var(--color-light);
	}

	.transaction_type {
		padding: 1rem 2rem 2rem;
		box-shadow: 0 1px 0px var(--color-dark),
								0 2px 0px var(--color-light);
	}
	.transaction_type .checkbox:nth-child(even) { margin: 0 2rem; }

	.price_range {
		padding: 1rem 2rem 2rem;
		box-shadow: 0 1px 0px var(--color-dark),
								0 2px 0px var(--color-light);
	}
	.price_range .range:nth-child(odd) { margin-bottom: 2rem; }
	.price_range .range input { margin: 0; }

	.features {
		padding: 1rem 2rem 2rem;
		box-shadow: 0 1px 0px var(--color-dark),
								0 2px 0px var(--color-light);
	}
	.features .number:nth-child(even) { margin: 0 1rem; }

	.others {
		padding: 1rem 2rem 2rem;
	}
	.others .row { align-items: baseline; }
</style>

<section class="filters">
	<div class="property_type">
		<h3>Property Type</h3>

		<label class="select">
			<select name="property_type" bind:value="{filter.filter_type}">
				<option>Residential</option>
				<option>Commercial</option>
				<option>Industrial</option>
			</select>
		</label>
	</div>

	<div class="transaction_type">
		<h3>Transaction Type</h3>

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
	</div>

	<div class="price_range">
		<h3>Price Range</h3>

		<div class="column">
			{#if (filter.filter_for).includes('Rent')}
			<label class="range column">
				{filter.rent} <input type="range" min="100" max="10000" step="100" bind:value="{filter.rent}"/> <small>monthly</small>
			</label>
			{/if}

			{#if (filter.filter_for).includes('Sale') || (filter.filter_for).includes('Investment')}
			<label class="range column">
				{filter.price} <input type="range" min="10000" max="10000000" step="10000" bind:value="{filter.price}"/> <small>price</small>
			</label>
			{/if}
		</div>
	</div>

	<div class="features">
		<h3>Features</h3>

		<div class="row">
			<label class="number">
				<input type="number" min="0" bind:value="{filter.beds}" /> beds
			</label>

			<label class="number">
				<input type="number" min="0" bind:value="{filter.baths}" /> baths
			</label>

			<label class="number">
				<input type="number" min="0" bind:value="{filter.rooms}" /> rooms
			</label>
		</div>
	</div>

	<div class="others">
		<h3>Others</h3>

		<div class="row">
			<label class="text">
				<input type="text" bind:value="{filter.msl}" /> msl
			</label>

			<Toggle bind:checked="{filter.active}" label="{filter.active ? 'Listed' : 'Delisted'}" />
			<!-- <label class="checkbox">
				<input type="checkbox" bind:checked="{filter.active}" />
				<span>Active</span>
			</label> -->
		</div>
	</div>
</section>
