<script setup lang="ts"></script>

<template>
  <div class="page-wrapper">
    <h1>About CityLink Connect</h1>

    <section class="card about-section">
      <img src="/favicon.svg" alt="CityLink Connect Logo" />
      <div class="vertical">
        <p>
          CityLink Connect is a platform that connects users with various city
          services. Our mission is to make it easier for residents to access and
          book services such as waste management, public transportation, and
          community events.
        </p>
        <p>
          We believe in fostering a connected community by providing a seamless
          experience for service bookings and information dissemination. Our
          platform is designed to be user-friendly and accessible to all
          residents.
        </p>
        <p>
          Whether you're looking to schedule a pickup for bulky waste, find out
          about upcoming local events, or get information on public transit
          schedules, CityLink Connect is here to help you stay informed and
          engaged with your city.
        </p>
      </div>
    </section>

    <section class="card team-section">
      <h2>Our Team</h2>
      <div class="horizontal">
        <div class="vertical">
          <p>
            Our team is composed of dedicated professionals passionate about
            improving urban living through technology. We work closely with city
            officials and community members to ensure our platform meets the
            needs of our users.
          </p>
          <p>
            From software developers to customer support specialists, each
            member of our team plays a crucial role in delivering a high-quality
            service experience. We are committed to continuous improvement and
            innovation to better serve our community.
          </p>
        </div>
        <img src="@/assets/team.jpg" alt="Our Team" />
      </div>
    </section>
  </div>
</template>

<style scoped>
h1 {
  margin-block-end: 1rem;
}

p {
  margin-block: 0.5rem;
}

.page-wrapper {
  display: grid;
  padding-block-end: 2rem;
}

section {
  display: flex;
}

.about-section {
  flex-direction: row;
  gap: 3rem;
  margin-block-end: 3rem;

  img {
    align-self: center;
  }
}

.team-section {
  flex-direction: column;

  > .horizontal {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  h2 {
    margin: 0;
    font-size: 2rem;
  }

  img {
    border-radius: 2rem;
    align-self: center;
  }
}

@media (width < 80ch) {
  .about-section {
    flex-direction: column;
    gap: 1rem;
  }

  .team-section {
    .horizontal {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
}

.vertical {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.horizontal {
  display: flex;
  flex-direction: row;
  gap: 3rem;
}
</style>
