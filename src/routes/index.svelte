<script lang="ts">
	import {currentGame, currentStriker} from '$stores';
	import {addFrame, createGame} from '$lib/game';
	import GameForm from '$components/GameForm.svelte';
	import {onMount} from 'svelte';
	import {goto} from '$app/navigation';

	function handleSubmit(event: CustomEvent) {
		const params = event.detail as Parameters<typeof createGame>;
		const firstPlayer = params[0][0];
		currentStriker.set(firstPlayer);

		const game = createGame(...params);
		currentGame.set(addFrame(game));
	}

	onMount(() => {
		currentGame.subscribe(game => {
			if (game) {
				goto('/game');
			}
		});
	});
</script>

<h1>Home page</h1>

<GameForm on:submit={handleSubmit} />
