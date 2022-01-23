<script lang="ts">
	import {goto} from '$app/navigation';
	import {browser} from '$app/env';
	import {currentGame} from '$stores';
	import {onMount} from 'svelte';

	onMount(() => {
		const localStorageKey = 'currentGame';

		const data = localStorage.getItem(localStorageKey);
		if (data !== 'undefined') {
			currentGame.set(JSON.parse(data));
		}

		currentGame.subscribe(game => {
			if (!game) {
				console.log('goto');
				return goto('/');
			}
			if (browser) {
				window.localStorage.setItem(localStorageKey, JSON.stringify(game));
			}
		});
	});
</script>

<slot />
