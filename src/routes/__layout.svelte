<script lang="ts">
	import {goto} from '$app/navigation';
	import {browser} from '$app/env';
	import {currentGame, currentStriker} from '$stores';
	import {onMount} from 'svelte';

	onMount(() => {
		const localStorageKeyGame = 'currentGame';
		const localStorageKeyStriker = 'currentStriker';

		const game = localStorage.getItem(localStorageKeyGame);
		if (game !== 'null') {
			currentGame.set(JSON.parse(game));
		}

		const striker = localStorage.getItem(localStorageKeyStriker);
		if (striker !== 'null') {
			currentStriker.set(striker);
		}

		currentGame.subscribe(game => {
			if (!game) {
				console.log('goto');
				return goto('/');
			}
			if (browser) {
				window.localStorage.setItem(localStorageKeyGame, JSON.stringify(game));
			}
		});
		currentStriker.subscribe(striker => {
			if (!striker) {
				return;
			}
			if (browser) {
				window.localStorage.setItem(localStorageKeyStriker, striker);
			}
		});
	});
</script>

<slot />
