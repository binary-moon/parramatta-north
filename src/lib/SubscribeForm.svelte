<script lang="ts">
  import Button from "./Button.svelte";

  let firstName = '';
  let lastName = '';
  let email = '';
  let firstNameError = false;
  let lastNameError = false;
  let emailError = false;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateForm = () => {
    firstNameError = !firstName;
    lastNameError = !lastName;
    emailError = !email || !emailPattern.test(email);
    return !firstNameError && !lastNameError && !emailError;
  }

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    if (validateForm()) {
      console.log({ firstName, lastName, email })
    }
  }
</script>
<form on:submit={handleSubmit} class="flex flex-col gap-12">
  <div>
    <label for="firstName" class="text-lg font-bold" class:text-error={firstNameError}>First Name*</label>
    <input id="firstName" type="text" class="input input-bordered w-full rounded" bind:value={firstName} class:input-error={firstNameError}>
  </div>
  <div>
    <label for="lastName" class="text-lg font-bold" class:text-error={lastNameError}>Last Name*</label>
    <input id="lastName" type="text" class="input input-bordered w-full rounded" bind:value={lastName} class:input-error={lastNameError}>
  </div>
  <div>
    <label for="email" class="text-lg font-bold" class:text-error={emailError}>Email Address*</label>
    <input id="email" type="email" class="input input-bordered w-full rounded" bind:value={email} class:input-error={emailError}>
  </div>
  <div class="flex flex-col gap-6 text-center">
    <Button type="submit" buttonStyle="primary">Subscribe</Button>
    <a href="/" class="underline">Cancel</a>
  </div>
</form>