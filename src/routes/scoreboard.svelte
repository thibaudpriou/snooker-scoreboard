<script lang="ts">
	import {currentGame} from '$stores';
	import HelpModal from '$components/HelpModal.svelte';
	import type {SnookerGame} from 'src/model';
	import {goto} from '$app/navigation';
	import {onMount} from 'svelte';

	let help: boolean = false;
	let game: SnookerGame | undefined;

	function handleKeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'h':
			case 'H':
				help = true;
				break;
		}
	}

	function handleKeyup(event: KeyboardEvent) {
		switch (event.key) {
			case 'h':
			case 'H':
				help = false;
				break;
		}
	}

	onMount(() => {
		currentGame.subscribe(g => {
			if (!g) {
				return goto('/');
			}
			game = g;
		});
	});
</script>

<svelte:window on:keydown={handleKeydown} on:keyup={handleKeyup} />

<div>
	<h1>Scoreboard page</h1>
	<a href="/">home page</a>

	{#if game}
		<p>Game started</p>
	{/if}

	{#if help}
		<div class="help-container">
			<HelpModal />
		</div>
	{/if}
</div>

<style>
	.help-container {
		position: absolute;
		display: block;
		top: 3em;
		right: 3em;
		left: 3em;
		bottom: 3em;
		padding: 2em;
		background-color: rgba(211, 211, 211, 0.8);
		font-size: 90%;
	}
</style>
