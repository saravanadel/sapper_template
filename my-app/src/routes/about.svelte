<script>
  import ApolloClient, { gql } from "apollo-boost";
  let result = [];
  let newval = "";

  const client = new ApolloClient({
    uri: "/graphql"
  });
  let res = client
    .query({
      query: gql`
        query {
          tasks {
            id
            name
          }
        }
      `
    })
    .then(res => {
      console.log(res);
      result = res.data.tasks;
    });

  function saveRec() {
    const ADD_TODO = gql`
      mutation AddTask($type: String!) {
        addTask(type: $type) {
          id
          name
        }
      }
    `;
    client
      .mutate({
        mutation: ADD_TODO,
        variables: {
          type: "MDEwOlJlcG9zaXRvcnk2MzM1MjkwNw=="
        }
      })
      .then(console.log);
  }
</script>

<svelte:head>
  <title>About</title>
</svelte:head>

<h1>About this site</h1>

<p>This is the 'about' page. There's not much here.</p>

<ul>

  {#each result as a}
    <li>{a.id} {a.name}</li>
  {/each}

</ul>
<div>
  Name:
  <input type="text" bind:value={newval} />
  <button on:click={saveRec}>Save</button>
</div>
