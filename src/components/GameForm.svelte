<script lang="ts">
	import {SnookerGameType} from '$model';

	import {createEventDispatcher} from 'svelte';
	import type {createGame} from '$lib/game';

	const dispatch = createEventDispatcher();

	let player1: string;
	let player2: string;
	let type: SnookerGameType = SnookerGameType['15balls'];

	const gameTypesOptions = [
		{
			value: SnookerGameType['15balls'],
			label: '15 Balls'
		},
		{
			value: SnookerGameType['10balls'],
			label: '6 Balls'
		},
		{
			value: SnookerGameType['6balls'],
			label: '10 Balls'
		}
	];

	function onSubmit(e: Event) {
		const players = [player1, player2];
		const payload: Parameters<typeof createGame> = [players, type];
		dispatch('submit', payload);
	}
</script>

<form on:submit|preventDefault={onSubmit} class="form">
	<fieldset>
		<label for="name">Player 1:</label>
		<input type="text" bind:value={player1} required />
	</fieldset>
	<fieldset>
		<label for="name">Player 2:</label>
		<input type="text" bind:value={player2} required />
	</fieldset>
	<fieldset>
		<label for="name">type:</label>
		<select bind:value={type} required>
			{#each gameTypesOptions as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</fieldset>
	<button type="submit">Start Game</button>
</form>

<style>
	.form > * {
		margin-top: 1em;
	}

	.form > *:first-child {
		margin-top: 0;
	}

	fieldset {
		border: none;
		padding: 0;
	}
</style>
