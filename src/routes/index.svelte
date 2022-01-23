<script lang="ts">
	import {currentGame} from '$stores';
	import {createGame} from '$lib/game';
	import {onMount} from 'svelte';
	import type {SnookerGame} from 'src/model';

	let game: SnookerGame | undefined;

	onMount(() => {
		const players = ['theo', 'thib'];
		setTimeout(() => {
			currentGame.set(createGame(players));
		}, 1000);
	});

	currentGame.subscribe(g => {
		game = g;
	});
</script>

<h1>Home page</h1>
<a href="/scoreboard">scoreboard page</a>

{#if game}
	<p>Game started: {game.type}</p>
{/if}
