<template>
	<section class="__not_found_page">
		<div class="absolute top-0 right-0 w-full __bg_gray" />
		<div class="__img_wrapper">
			<img src="@/assets/images/404.png" />
		</div>
		<div class="__content">
			<h1 class="__header">۴۰۴</h1>
			<h4 class="__text">
				<p>متاسفانه صفحه</p>
				<p>مورد نظر شما پیدا نشد!</p>
			</h4>
			<router-link to="/" style="width: 92% !important">
				<Button label="بازگشت به داشبورد" class="w-full h-12 rounded-lg mt-4" outlined />
			</router-link>
		</div>
	</section>
</template>

<style scoped>
.__not_found_page {
	gap: 6rem !important;

	@apply relative flex justify-center items-center h-screen;
}

.__bg_gray {
	height: 67% !important;
	z-index: -10 !important;
	background-color: rgb(229 231 235) !important;
}

.__content {
	@apply flex flex-col items-center pb-20;
}

.__content h1,
.__content h4 {
	@apply text-center;
}

.__header {
	font-size: 6rem !important;
	line-height: 1 !important;
	font-weight: 1000;
}

.__text {
	font-size: 2.25rem !important;
	line-height: 2.5rem !important;
	font-weight: 500 !important;
	margin-top: 1.25rem !important;
	margin-bottom: 1.25rem !important;
}

.__text p {
	margin-bottom: 1.75rem !important;
}

@media (max-width: 768px) {
	.__not_found_page {
		gap: 0 !important;
		flex-direction: column !important;
	}

	.__bg_gray {
		height: 50% !important;
	}

	.__img_wrapper {
		width: 200px;
	}

	.__content {
		padding-bottom: 0;
		padding-top: 2.5rem;
	}

	.__header {
		font-size: 4rem !important;
		font-weight: 600;
	}

	.__text {
		font-size: 1.5rem !important;
		line-height: 2rem !important;
		font-weight: 300 !important;
		margin-top: 0.5rem !important;
		margin-bottom: 0.5rem !important;
	}

	.__text p {
		margin-bottom: 0 !important;
	}
}
</style>
