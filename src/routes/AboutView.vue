<script setup lang="ts"></script>

<template>
  <div class="page-wrapper">
    <h1>About CityLink Connect</h1>

    <div class="about-cards">
      <section class="card about-card section-about">
        <img
          class="image-logo"
          src="/favicon.svg"
          alt="CityLink Connect Logo"
        />
        <div class="content">
          <p>
            CityLink Connect is a platform that connects users with various city
            services. Our mission is to make it easier for residents to access
            and book services such as waste management, public transportation,
            and community events.
          </p>
          <p>
            We believe in fostering a connected community by providing a
            seamless experience for service bookings and information
            dissemination. Our platform is designed to be user-friendly and
            accessible to all residents.
          </p>
          <p>
            Whether you're looking to schedule a pickup for bulky waste, find
            out about upcoming local events, or get information on public
            transit schedules, CityLink Connect is here to help you stay
            informed and engaged with your city.
          </p>
        </div>
      </section>

      <section class="card about-card">
        <div class="content">
          <h2>Our Team</h2>
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
        <img class="image-cover" src="@/assets/team.jpg" alt="" />
      </section>
    </div>
  </div>
</template>

<style scoped>
.about-cards {
  display: grid;
  gap: 1rem;
}

.about-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (width < 60ch) {
    grid-template-columns: 1fr !important;
  }

  h2 {
    font-size: clamp(1.5rem, 3.5vw, 2rem);
  }

  img {
    border-radius: 1rem;
    place-self: center;
  }

  img.image-cover {
    object-fit: cover;
    height: 100%;
    width: 100%;
  }
}

.section-about {
  grid-template-columns: 0.5fr 1fr;
}

.image-logo {
  width: 100%;
  max-height: 12rem;
}
</style>
