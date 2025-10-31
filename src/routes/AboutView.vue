<script setup lang="ts"></script>

<template>
  <div class="page-wrapper">
    <h1>About CityLink Connect</h1>

    <div class="ContentClass">
      <div>
        <img src="/favicon.svg" alt="CityLink Connect Logo" width="200" />
      </div>
      <div class="ContentClass-Horizontal">
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
    </div>
    <div class="ContentClass">
      <div>
        <h2>Our Team</h2>
        <div class="ContentClass-Horizontal">
          <div>
            <p>
              Our team is composed of dedicated professionals passionate about
              improving urban living through technology. We work closely with
              city officials and community members to ensure our platform meets
              the needs of our users.
            </p>
            <p>
              From software developers to customer support specialists, each
              member of our team plays a crucial role in delivering a
              high-quality service experience. We are committed to continuous
              improvement and innovation to better serve our community.
            </p>
          </div>

          <img src="@/assets/Images/team.jpg" alt="Our Team" width="300" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  color: #2c3e50;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  font-weight: 700;
}

h2 {
  color: #34495e;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.ContentClass {
  display: flex;
  gap: 3rem;
  align-items: flex-start;
  margin-bottom: 3rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ContentClass-Horizontal {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  flex: 1;
}

.ContentClass-Horizontal p {
  color: #555;
  line-height: 1.7;
  margin-bottom: 1rem;
  font-size: 1.05rem;
}

.ContentClass img {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  object-fit: cover;
}

.ContentClass-Horizontal img {
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  align-self: center;
}

/* First ContentClass specific styling */
.ContentClass:first-of-type .ContentClass-Horizontal {
  flex-direction: column;
}

.ContentClass:first-of-type img {
  flex-shrink: 0;
}

/* Second ContentClass specific styling */
.ContentClass:last-of-type .ContentClass-Horizontal {
  flex-direction: row;
}

.ContentClass:last-of-type .ContentClass-Horizontal > div {
  flex: 1;
}

.ContentClass:last-of-type .ContentClass-Horizontal img {
  flex-shrink: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .ContentClass {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .ContentClass-Horizontal {
    flex-direction: column;
    gap: 1.5rem;
  }

  .ContentClass:last-of-type .ContentClass-Horizontal {
    flex-direction: column;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .ContentClass {
    padding: 1rem;
    margin-bottom: 2rem;
  }

  h1 {
    font-size: 1.75rem;
  }

  .ContentClass-Horizontal p {
    font-size: 1rem;
  }
}
</style>
