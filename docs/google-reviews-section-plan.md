# Project Plan: Adding Google Business Reviews Section

**Goal:** Integrate a dynamic section on the home page (`src/pages/index.js`) to display the 20 newest, highest-rated reviews from your Google Business Profile, along with the total review count and average rating.

**Steps:**

1.  **Securely Store API Key and Place ID:**
    *   Store the Google Places API Key and your business's Place ID as environment variables in your Next.js project (e.g., in a `.env.local` file). This is crucial for security.

2.  **Create Server-Side API Endpoint:**
    *   Create a new API route file (e.g., `src/pages/api/google-reviews.js`).
    *   This endpoint will handle requests from the frontend.
    *   It will use a library like `google-maps-services-js` or a direct `fetch` call to the Google Places API Place Details endpoint.
    *   It will use the stored API key and Place ID.
    *   It will request only the necessary fields using a field mask: `reviews`, `rating`, and `user_ratings_total`.
    *   It will process the fetched reviews:
        *   Filter reviews to include only those with a high rating (e.g., 4 or 5 stars, we can confirm this threshold).
        *   Sort the filtered reviews by time (newest first).
        *   Select the top 20 reviews from the sorted list.
    *   It will implement a caching mechanism (e.g., using an in-memory cache like `node-cache`) to store the results for a set period (e.g., 1 hour) to reduce API calls and improve performance.
    *   It will return the selected reviews, the total review count, and the average rating to the frontend.

3.  **Create Frontend React Component:**
    *   Create a new component file (e.g., `src/components/GoogleReviewsSection/index.js`).
    *   This component will be responsible for fetching data from the server-side API endpoint created in Step 2.
    *   It will use a data fetching method (e.g., `fetch` or a library like `swr` for client-side fetching with caching/revalidation benefits).
    *   It will display a loading state while fetching data and an error state if fetching fails.
    *   It will render the average rating and the total number of reviews prominently.
    *   It will iterate through the fetched reviews and display each review's content, author, and rating.
    *   Consider using a simple list or a carousel/slider for displaying the 20 reviews.

4.  **Style the Component:**
    *   Create a CSS Module file for the component (e.g., `src/components/GoogleReviewsSection/GoogleReviewsSection.module.scss`).
    *   Write CSS rules to style the review section, individual reviews, rating display, and total count.
    *   Ensure the styling is consistent with the existing home page design by referencing the structure and styles used in components like `Section` and `BentoDestinations`.

5.  **Integrate into Home Page:**
    *   Open `src/pages/index.js`.
    *   Import the `GoogleReviewsSection` component.
    *   Locate the target section based on the provided selector (`#__next > div > div > main > section.Section_section__gjwvr.Home_destinationsSection__ImAP_`). This likely corresponds to a `<section>` element with specific class names.
    *   Place the `<GoogleReviewsSection />` component within or immediately after this target section in the JSX structure.

6.  **Testing and Refinement:**
    *   Test the implementation locally to ensure data is fetched and displayed correctly.
    *   Verify the filtering and sorting of reviews.
    *   Check the styling and responsiveness.
    *   Monitor performance and adjust caching duration if needed.

**Data Flow Diagram:**

```mermaid
graph TD
    A[User Browser] --> B[Next.js Home Page]
    B --> C[GoogleReviewsSection Component]
    C --> D[Fetch Data from /api/google-reviews]
    D --> E[Next.js Server-Side API Route]
    E --> F{Cache Check}
    F -- Cache Hit --> E
    F -- Cache Miss --> G[Google Places API]
    G --> E
    E --> D
    D --> C
    C --> B
    B --> A