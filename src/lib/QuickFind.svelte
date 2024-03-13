<script lang="ts">
  import IconCard from "./IconCard.svelte";
</script>
<div class="flex flex-col gap-6 bg-neutral-content pt-6 pb-12">
  <h4 class="text-[22px]/[28px] font-bold px-6">Quick find</h4>
  <div class="carousel carousel-center w-full px-6 space-x-2">
    <div class="carousel-item w-[120px]">
      <IconCard
        icon="/Icon_Points_of_Interest.svg"
        title="Points of Interest"
        href="/points-of-interest"
      />
    </div>
    <div class="carousel-item w-[120px]">
      <IconCard
        icon="/Icon_Interactives.svg"
        title="Interactives"
        href="/interactives"
      />
    </div>
    <div class="carousel-item w-[120px]">
      <IconCard
        icon="/Icon_Food_Drink.svg"
        title="Food & Drink"
        href="/food-and-drink"
      />
    </div>
    <div class="carousel-item w-[120px]">
      <IconCard
        icon="/Icon_Points_of_Interest.svg"
        title="Points of Interest"
        href="/points-of-interest"
      />
    </div>
    <div class="carousel-item w-[120px]">
      <IconCard
        icon="/Icon_Interactives.svg"
        title="Interactives"
        href="/interactives"
      />
    </div>
    <div class="carousel-item w-[120px]">
      <IconCard
        icon="/Icon_Food_Drink.svg"
        title="Food & Drink"
        href="/food-and-drink"
      />
    </div>
  </div>
</div>