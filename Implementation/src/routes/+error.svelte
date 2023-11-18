<script lang="ts">
	import { base } from '$app/paths';
	import { page } from '$app/stores';
</script>

<div class="d-flex justify-content-center">
	<div class="d-flex flex-column align-items-center">
		<h1 class="text-danger">Error {$page.status}</h1>
		<h6>{$page.error?.message ?? 'There was an unknown error'}</h6>
		<br />
		<a href="{base}/" class="btn btn-primary">Home</a>
	</div>
</div>
