<script lang="ts">
	import {goto} from '$app/navigation';

	import {currentGame} from '$stores';
	import {onMount} from 'svelte';

	onMount(() => {
		currentGame.subscribe(g => {
			if (!g) {
				console.log('goto');
				return goto('/');
			}
		});
	});
</script>

<slot />
