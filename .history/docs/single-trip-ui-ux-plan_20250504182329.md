# Single Trip Page UI/UX Improvement Plan

This document outlines the proposed plan to enhance the user interface and user experience of the single trip page.

## Current State Analysis

The current single trip page displays basic information such as title, duration, price, description, cost inclusions/exclusions, itineraries, and FAQs in a linear layout.

## Areas for Improvement

Based on the analysis, the following areas have been identified for improvement:

*   **Visual Hierarchy and Layout:** Improve the visual structure to highlight key information and guide user flow.
*   **Trip Highlights:** Prominently display key features and selling points of the trip.
*   **Itinerary Presentation:** Enhance the presentation of the daily itinerary for better readability and interaction.
*   **Cost Breakdown:** Improve the formatting of cost inclusions and exclusions.
*   **Call to Action:** Add a clear and accessible call to action for booking or inquiry.
*   **Image Gallery:** Potentially add a gallery to showcase multiple trip images.
*   **Mobile Responsiveness:** Ensure optimal display and functionality on all devices.

## Proposed UI/UX Enhancements

The following enhancements are proposed to address the identified areas for improvement:

1.  **Enhance Hero Section:**
    *   Utilize the featured image as a prominent background for the top section of the page.
    *   Overlay the trip title, duration, and price in a clear and visually appealing manner on top of the background image.

2.  **Add Overview Section:**
    *   Create a dedicated section below the hero to provide a concise overview of the trip.
    *   Include the main trip description.
    *   Extract and display key highlights from the trip data, such as the countries visited and major activities mentioned in the description or itineraries. Use relevant icons to make these highlights easily scannable.

3.  **Improve Itinerary Presentation:**
    *   Transform the current simple list of itineraries into a more interactive format.
    *   Implement each day's itinerary as a collapsible section (like an accordion), showing only the title initially and allowing users to expand for details. This helps manage content length and improves navigation.

4.  **Format Inclusions/Exclusions:**
    *   Present the "What's Included" and "What's Not Included" information in two distinct, clearly labeled lists.
    *   Use bullet points or icons to enhance readability and make it easy for users to quickly understand what is covered in the price.

5.  **Implement FAQ Accordion:**
    *   Similar to the itinerary, present the Frequently Asked Questions (FAQs) using a collapsible accordion structure. This keeps the FAQ section organized and prevents it from overwhelming the page if there are many questions.

6.  **Add Prominent Call to Action:**
    *   Integrate a clear and easily accessible "Inquire Now" or "Book Now" button.
    *   Consider making this button sticky so it remains visible as the user scrolls down the page, encouraging conversions.

7.  **Consider Image Gallery:**
    *   If the trip data structure allows for multiple images beyond just a single featured image, add an image gallery section to showcase more visuals of the destinations and activities.

8.  **Ensure Mobile Responsiveness:**
    *   Throughout the design and implementation process, prioritize mobile responsiveness to ensure the page looks and functions well on various devices.

## Implementation Plan

1.  **Detailed Design:** Create a more detailed design or wireframe based on the approved plan.
2.  **Code Implementation:** Modify the `src/pages/trips/[slug].js` file and the associated SCSS file (`src/styles/pages/SingleTrip.module.scss`) to implement the approved design. This will involve updating the JSX structure and styling.
3.  **Testing:** Test the updated page for functionality and responsiveness across different devices.

## Provided Trip Data

```json
{
    "id": 18766,
    "date": "2025-05-04T18:10:14",
    "date_gmt": "2025-05-04T15:10:14",
    "guid": {
        "rendered": "https://madaratalkon.com/?post_type=trip&#038;p=18766"
    },
    "modified": "2025-05-04T18:10:17",
    "modified_gmt": "2025-05-04T15:10:17",
    "slug": "%d8%a7%d9%84%d8%b3%d9%81%d8%b1-%d8%a7%d9%84%d9%89-%d8%a7%d9%8a%d8%b7%d8%a7%d9%84%d9%8a%d8%a7-%d9%88%d8%af%d9%88%d9%84-%d8%a3%d9%88%d8%b1%d9%88%d8%a8%d8%a7-14-%d9%8a%d9%88%d9%85",
    "status": "publish",
    "type": "trip",
    "link": "https://madaratalkon.com/trip/%d8%a7%d9%84%d8%b3%d9%81%d8%b1-%d8%a7%d9%84%d9%89-%d8%a7%d9%8a%d8%b7%d8%a7%d9%84%d9%8a%d8%a7-%d9%88%d8%af%d9%88%d9%84-%d8%a3%d9%88%d8%b1%d9%88%d8%a8%d8%a7-14-%d9%8a%d9%88%d9%85/",
    "title": {
        "rendered": "السفر الى ايطاليا ودول أوروبا 14 يوم"
    },
    "content": {
        "rendered": "<p>السفر إلى إيطاليا ودول أوروبا لمدة 14 يوم، استعد لمغامرة لا تُنسى تأخذك في رحلة عبر أشهر المعالم السياحية في إيطاليا ودول أخرى رائعة.<br>ابدأ من روما بأبنيتها التاريخية ومعالمها الشهيرة مثل الكولوسيوم وسانت بيتر، ثم استمتع بجولة في البندقية، عاصمة الحب والمياه. بعدها، اتجه إلى فرنسا لتكتشف جمال باريس، أو تنقل بين شوارع أمستردام في هولندا، ومرر إلى برلين في ألمانيا.<br>رحلة شاملة تمنحك فرصة لاستكشاف التاريخ، الفن، والطبيعة في قلب القارة الأوروبية.</p>",
        "protected": false
    },
    "excerpt": {
        "rendered": "<p>السفر إلى إيطاليا ودول أوروبا لمدة 14 يوم، استعد لمغامرة لا تُنسى تأخذك في رحلة عبر أشهر المعالم السياحية في إيطاليا ودول أخرى رائعة.ابدأ من روما بأبنيتها التاريخية ومعالمها الشهيرة مثل الكولوسيوم وسانت بيتر، ثم استمتع بجولة في البندقية، عاصمة الحب والمياه. بعدها، اتجه إلى فرنسا لتكتشف جمال باريس، أو تنقل بين شوارع أمستردام في&#8230;</p>\n",
        "protected": false
    },
    "author": 15,
    "featured_media": 0,
    "comment_status": "closed",
    "ping_status": "closed",
    "template": "",
    "destination": [],
    "trip_types": [],
    "trip_tag": [],
    "class_list": [
        "post-18766",
        "trip",
        "type-trip",
        "status-publish",
        "hentry",
        "pmpro-has-access"
    ],
    "packages_ids": [
        18774
    ],
    "trip_extras": [],
    "cut_off_time": {
        "enabled": false,
        "duration": 0,
        "duration_unit": "days"
    },
    "booked-seats": [],
    "acf": [],
    "yoast_head": "<!-- This site is optimized with the Yoast SEO Premium plugin v24.9 (Yoast SEO v25.0) - https://yoast.com/wordpress/plugins/seo/ -->\n<title>السفر الى ايطاليا ودول أوروبا 14 يوم - مدارات الكون</title>\n<meta name=\"robots\" content=\"index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1\" />\n<link rel=\"canonical\" href=\"https://madaratalkon.com/trip/السفر-الى-ايطاليا-ودول-أوروبا-14-يوم/\" />\n<meta property=\"og:locale\" content=\"ar_AR\" />\n<meta property=\"og:type\" content=\"article\" />\n<meta property=\"og:title\" content=\"السفر الى ايطاليا ودول أوروبا 14 يوم\" />\n<meta property=\"og:description\" content=\"السفر إلى إيطاليا ودول أوروبا لمدة 14 يوم، استعد لمغامرة لا تُنسى تأخذك في رحلة عبر أشهر المعالم السياحية في إيطاليا ودول أخرى رائعة.ابدأ من روما بأبنيتها التاريخية ومعالمها الشهيرة مثل الكولوسيوم وسانت بيتر، ثم استمتع بجولة في البندقية، عاصمة الحب والمياه. بعدها، اتجه إلى فرنسا لتكتشف جمال باريس، أو تنقل بين شوارع أمستردام في...\" />\n<meta property=\"og:url\" content=\"https://madaratalkon.com/trip/السفر-الى-ايطاليا-ودول-أوروبا-14-يوم/\" />\n<meta property=\"og:site_name\" content=\"مدارات الكون\" />\n<meta property=\"article:modified_time\" content=\"2025-05-04T15:10:17+00:00\" />\n<meta name=\"twitter:card\" content=\"summary_large_image\" />\n<meta name=\"twitter:label1\" content=\"Est. reading time\" />\n\t<meta name=\"twitter:data1\" content=\"5 دقائق\" />\n<script type=\"application/ld+json\" class=\"yoast-schema-graph\">{\"@context\":\"https://schema.org\",\"@graph\":[{\"@type\":\"WebPage\",\"@id\":\"https://madaratalkon.com/trip/%d8%a7%d9%84%d8%b3%d9%81%d8%b1-%d8%a7%d9%84%d9%89-%d8%a7%d9%8a%d8%b7%d8%a7%d9%84%d9%8a%d8%a7-%d9%88%d8%af%d9%88%d9%84-%d8%a3%d9%88%d8%b1%d9%88%d8%a8%d8%a7-14-%d9%8a%d9%88%d9%85/\",\"url\":\"https://madaratalkon.com/trip/%d8%a7%d9%84%d8%b3%d9%81%d8%b1-%d8%a7%d9%84%d9%89-%d8%a7%d9%8a%d8%b7%d8%a7%d9%84%d9%8a%d8%a7-%d9%88%d8%af%d9%88%d9%84-%d8%a3%d9%88%d8%a8%d8%a7-14-%d9%8a%d9%88%d9%85/\",\"name\":\"السفر الى ايطاليا ودول أوروبا 14 يوم - مدارات الكون\",\"isPartOf\":{\"@id\":\"https://madaratalkon.com/#website\"},\"datePublished\":\"2025-05-04T15:10:14+00:00\",\"dateModified\":\"2025-05-04T15:10:17+00:00\",\"breadcrumb\":{\"@id\":\"https://madaratalkon.com/trip/%d8%a7%d9%84%d8%b3%d9%81%d8%b1-%d8%a7%d9%84%d9%89-%d8%a7%d9%8a%d8%b7%d8%a7%d9%84%d9%8a%d8%a7-%d9%88%d8%af%d9%88%d9%84-%d8%a3%d9%88%d8%a8%d8%a7-14-%d9%8a%d9%88%d9%85/#breadcrumb\"},\"inLanguage\":\"ar\",\"potentialAction\":[{\"@type\":\"ReadAction\",\"target\":[\"https://madaratalkon.com/trip/%d8%a7%d9%84%d8%b3%d9%81%d8%b1-%d8%a7%d9%84%d9%89-%d8%a7%d9%8a%d8%b7%d8%a7%d9%84%d9%8a%d8%a7-%d9%88%d8%af%d9%88%d9%84-%d8%a3%d9%88%d8%a8%d8%a7-14-%d9%8a%d9%88%d9%85/\"]}]},{\"@type\":\"BreadcrumbList\",\"@id\":\"https://madaratalkon.com/trip/%d8%a7%d9%84%d8%b3%d9%81%d8%b1-%d8%a7%d9%84%d9%89-%d8%a7%d9%8a%d8%b7%d8%a7%d9%84%d9%8a%d8%a7-%d9%88%d8%af%d9%88%d9%84-%d8%a3%d9%88%d8%a8%d8%a7-14-%d9%8a%d9%88%d9%85/#breadcrumb\",\"itemListElement\":[{\"@type\":\"ListItem\",\"position\":1,\"name\":\"Home\",\"item\":\"https://madaratalkon.com/\"},{\"@type\":\"ListItem\",\"position\":2,\"name\":\"Trips\",\"item\":\"https://madaratalkon.com/trip/\"},{\"@type\":\"ListItem\",\"position\":3,\"name\":\"السفر الى ايطاليا ودول أوروبا 14 يوم\"}]}]},{\"@type\":\"WebSite\",\"@id\":\"https://madaratalkon.com/#website\",\"url\":\"https://madaratalkon.com/\",\"name\":\"مدارات الكون\",\"description\":\"شركة مدارات للسفر والسياحة | عروض سفر | عروض سياحية\",\"potentialAction\":[{\"@type\":\"SearchAction\",\"target\":{\"@type\":\"EntryPoint\",\"urlTemplate\":\"https://madaratalkon.com/?s={search_term_string}\"},\"query-input\":{\"@type\":\"PropertyValueSpecification\",\"valueRequired\":true,\"valueName\":\"search_term_string\"}}],\"inLanguage\":\"ar\"}]}</script>\n<!-- / Yoast SEO Premium plugin. -->",
    "yoast_head_json": {
        "title": "السفر الى ايطاليا ودول أوروبا 14 يوم - مدارات الكون",
        "robots": {
            "index": "index",
            "follow": "follow",
            "max-snippet": "max-snippet:-1",
            "max-image-preview": "max-image-preview:large",
            "max-video-preview": "-1"
        },
        "canonical": "https://madaratalkon.com/trip/السفر-الى-ايطاليا-ودول-أوروبا-14-يوم/",
        "og_locale": "ar_AR",
        "og_type": "article",
        "og_title": "السفر الى ايطاليا ودول أوروبا 14 يوم",
        "og_description": "السفر إلى إيطاليا ودول أوروبا لمدة 14 يوم، استعد لمغامرة لا تُنسى تأخذك في رحلة عبر أشهر المعالم السياحية في إيطاليا ودول أخرى رائعة.ابدأ من روما بأبنيتها التاريخية ومعالمها الشهيرة مثل الكولوسيوم وسانت بيتر، ثم استمتع بجولة في البندقية، عاصمة الحب والمياه. بعدها، اتجه إلى فرنسا لتكتشف جمال باريس، أو تنقل بين شوارع أمستردام في...",
        "og_url": "https://madaratalkon.com/trip/السفر-الى-ايطاليا-ودول-أوروبا-14-يوم/",
        "og_site_name": "مدارات الكون",
        "article_modified_time": "2025-05-04T15:10:17+00:00",
        "twitter_card": "summary_large_image",
        "twitter_misc": {
            "Est. reading time": "5 دقائق"
        },
        "schema": {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebPage",
                    "@id": "https://madaratalkon.com/trip/%d8%a7%d9%84%d8%b3%d9%81%d8%b1-%d8%a7%d9%84%d9%89-%d8%a7%d9%8a%d8%b7%d8%a7%d9%84%d9%8a%d8%a7-%d9%88%d8%af%d9%88%d9%84-%d8%a3%d9%88%d8%b1%d9%88%d8%a8%d8%a7-14-%d9%8a%d9%88%d9%85/",
                    "url": "https://madaratalkon.com/trip/%d8%a7%d9%84%d8%b3%d9%81%d8%b1-%d8%a7%d9%84%d9%89-%d8%a7%d9%8a%d8%b7%d8%a7%d9%84%d9%8a%d8%a7-%d9%88%d8%af%d9%88%d9%84-%d8%a3%d9%88%d8%b1%d9%88%d8%a8%d8%a7-14-%d9%8a%d9%88%d9%85/",
                    "name": "السفر الى ايطاليا ودول أوروبا 14 يوم - مدارات الكون",
                    "isPartOf": {
                        "@id": "https://madaratalkon.com/#website"
                    },
                    "datePublished": "2025-05-04T15:10:14+00:00",
                    "dateModified": "2025-05-04T15:10:17+00:00",
                    "breadcrumb": {
                        "@id": "https://madaratalkon.com/trip/%d8%a7%d9%84%d8%b3%d9%81%d8%b1-%d8%a7%d9%84%d9%89-%d8%a7%d9%8a%d8%b7%d8%a7%d9%84%d9%8a%d8%a7-%d9%88%d8%af%d9%88%d9%84-%d8%a3%d9%88%d8%b1%d9%88%d8%a8%d8%a7-14-%d9%8a%d9%88%d9%85/#breadcrumb"
                    },
                    "inLanguage": "ar",
                    "potentialAction": [
                        {
                            "@type": "ReadAction",
                            "target": [
                                "https://madaratalkon.com/trip/%d8%a7%d9%84%d8%b3%d9%81%d8%b1-%d8%a7%d9%84%d9%89-%d8%a7%d9%8a%d8%b7%d8%a7%d9%84%d9%8a%d8%a7-%d9%88%d8%af%d9%88%d9%84-%d8%a3%d9%88%d8%a8%d8%a7-14-%d9%8a%d9%88%d9%85/"
                            ]
                        }
                    ]
                },
                {
                    "@type": "BreadcrumbList",
                    "@id": "https://madaratalkon.com/trip/%d8%a7%d9%84%d8%b3%d9%81%d8%b1-%d8%a7%d9%84%d9%89-%d8%a7%d9%8a%d8%b7%d8%a7%d9%84%d9%8a%d8%a7-%d9%88%d8%af%d9%88%d9%84-%d8%a3%d9%88%d8%a8%d8%a7-14-%d9%8a%d9%88%d9%85/#breadcrumb",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://madaratalkon.com/"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Trips",
                            "item": "https://madaratalkon.com/trip/"
                        },
                        {
                            "@type": "ListItem",
                            "position": 3,
                            "name": "السفر الى ايطاليا ودول أوروبا 14 يوم"
                        }
                    ]
                },
                {
                    "@type": "WebSite",
                    "@id": "https://madaratalkon.com/#website",
                    "url": "https://madaratalkon.com/",
                    "name": "مدارات الكون",
                    "description": "شركة مدارات للسفر والسياحة | عروض سفر | عروض سياحية",
                    "potentialAction": [
                        {
                            "@type": "SearchAction",
                            "target": {
                                "@type": "EntryPoint",
                                "urlTemplate": "https://madaratalkon.com/?s={search_term_string}"
                            },
                            "query-input": {
                                "@type": "PropertyValueSpecification",
                                "valueRequired": true,
                                "valueName": "search_term_string"
                            }
                        }
                    ],
                    "inLanguage": "ar"
                }
            ]
        }
    },
    "trip_available_months": "",
    "wpte_gallery_id": {
        "enable": false
    },
    "wpte_vid_gallery": "",
    "wp_travel_engine_featured_trip": "",
    "_thumbnail_id": "",
    "wp_travel_engine_setting_trip_actual_price": "4999",
    "_s_price": "4999",
    "_aioseo_description": "",
    "code": "2505715",
    "price": 4999,
    "has_sale": 0,
    "sale_price": 0,
    "discount_percent": 0,
    "currency": {
        "code": "SAR",
        "symbol": "&#x631;.&#x633;"
    },
    "duration": {
        "days": 14,
        "nights": 13,
        "duration_unit": "days",
        "duration_type": "days"
    },
    "primary_category": "27",
    "available_times": {
        "type": "default",
        "items": [
            "2021-1-01",
            "2021-2-01",
            "2021-3-01",
            "2021-4-01",
            "2021-5-01",
            "2021-6-01",
            "2021-7-01",
            "2021-8-01",
            "2021-9-01",
            "2021-10-01",
            "2021-11-01",
            "2021-12-01"
        ]
    },
    "min_pax": "",
    "max_pax": "",
    "description": "<!-- wp:paragraph -->\n<p>الدول:<br>ايطاليا - النمسا - المجر - التشيك - المانيا - هولندا<br>المدة:<br>14 أيام</p>\n<!-- /wp:paragraph -->",
    "cost_includes": "الإقامة في الفنادق\nإفطار يومي\nوجبة عشاء في النمسا\nالجولات والتوصيلات\nاستقبال المطار\nمرشد سياحي\nالتنقلات بين المدن\nجولات سياحية ومسائية\nدخوليات المزارات\nالمنتدي الروماني فى روما\nمصنع مورانو للزجاج\nقلعة براغ\nمصنع تقطيع الالماس فى امستردام\nتلفريك ستينبلاتيه\nجولات مائية\nقارب فينيسيا في ايطاليا\nبحيرة تراونزي في النمسا\nنهر الدانوب في المجر\nنهر فولدافا في التشيك\nجولة الراين\nجولة بحيرة فولندام",
    "cost_excludes": "الطيران الدولي \nتوصيل مطار اخر يوم \nالشنغن",
    "itineraries": [
        {
            "title": "الوصول إلى روما",
            "content": "<!-- wp:paragraph -->\n<p>نصل اليوم إلى روما، عاصمة السياحة في إيطاليا، حيث يتم استقبالكم من قبل مندوبنا الخاص ونقلكم إلى الفندق بسيارة خاصة. كما نقدم خدمة توصيل ذهابًا وإيابًا إلى وسط المدينة في مساء اليوم. لمزيد من المعلومات عن الجولات القادمة، يمكنكم الاطلاع على لوحة الإعلانات في الفندق.</p>\n<!-- /wp:paragraph -->"
        },
        {
            "title": "جولة في معالم ايطاليا",
            "content": "<!-- wp:paragraph -->\n<p>بعد الإفطار، نبدأ جولة في معالم ايطاليا، حيث نكتشف معالمها الرائعة مثل الكولسيوم، المنتديات الإمبراطورية، القلاع و الكنائس. في المساء، نقدم لكم خدمة توصيل إلى منطقة تراستيفيري للاستمتاع بالعشاء والتنزه في أحد أجمل أحياء المدينة.</p>\n<!-- /wp:paragraph -->"
        },
        {
            "title": "جولة سياحية في فلورنسا ",
            "content": "<!-- wp:paragraph -->\n<p>مغادرة روما باتجاه شمال إيطاليا، حيث نتمتع بالمناظر الخلابة لجبال توسكانا أثناء الطريق. عند الوصول إلى فلورنسا، نبدأ جولتنا بزيارة ساحة مايكل أنجلو المدهشة، وفي المساء جولة سياحية مع مرشد محلي لاستكشاف المعالم التاريخية، مع وقت حر للتجول في المدينة.</p>\n<!-- /wp:paragraph -->"
        },
        {
            "title": "جولة سياحية في فينيسيا ايطاليا",
            "content": "<!-- wp:paragraph -->\n<p>مغادرة فلورنسا إلى فينيسيا عبر جبال أبيناين. فور وصولنا، ننتقل باستخدام الباص المائي للتجول في مدن هولندا الأسطورية، حيث نكتشف ساحة سان ماركوس و مصنع موارنو للزجاج. بعدها، نتمتع بوقت حر لاستكشاف المدينة، مع فرصة لتجربة ركوب الجندولا في قنوات فينيسيا.</p>\n<!-- /wp:paragraph -->"
        },
        {
            "title": "الذهاب إلى إنسبروك – سالزبورغ ",
            "content": "<!-- wp:paragraph -->\n<p>نغادر فينيسيا إلى إنسبروك، عاصمة جبال الآلب. بعد وقت حر للتجول في المدينة، نواصل الرحلة نحو سالزبورغ، مع إطلالات خلابة على مدن النمسا السياحية، ونصل في نهاية اليوم إلى سالزبورغ.</p>\n<!-- /wp:paragraph -->"
        },
        {
            "title": "سالزبورغ – فيينا ",
            "content": "<!-- wp:paragraph -->\n<p>بعد الإفطار، نكتشف مدينة سالزبورغ الجميلة، المصنفة ضمن مواقع التراث العالمي. نواصل طريقنا إلى فيينا، حيث نزور بحيرة تراونزي في منطقة تراونكيرشن، مع رحلة بالقارب للاستمتاع بمناظر القلاع الأربعة. مساءً، نصل إلى فيينا.</p>\n<!-- /wp:paragraph -->"
        },
        {
            "title": "جولة في فيينا",
            "content": "<!-- wp:paragraph -->\n<p>نبدأ اليوم بجولة في فيينا مع مرشد سياحي، حيث نكتشف قصورها الشهيرة وحدائقها الجميلة. بعد الظهر، سيكون لديكم وقت حر لاستكشاف المدينة بأنفسكم، وفي المساء، نتوجه إلى وسط المدينة للاستمتاع بالعشاء في جو ساحر.</p>\n<!-- /wp:paragraph -->"
        },
        {
            "title": "فيينا – بودابست – ملكة نهر الدانوب",
            "content": "<!-- wp:paragraph -->\n<p>مغادرة فيينا إلى بودابست، حيث نقدم لكم جولة تعريفية على المدينة الرائعة التي تقع على ضفاف نهر الدانوب. في المساء، يمكنكم قضاء وقت حر في منطقة فاسي أوتكا، المشهورة بمطاعمها وأجوائها الحيوية.</p>\n<!-- /wp:paragraph -->"
        },
        {
            "title": "ودابست – براتيسلافا – براغ",
            "content": "<!-- wp:paragraph -->\n<p>ننتقل من بودابست إلى براتيسلافا، ثم نواصل الرحلة إلى براغ. عند وصولنا إلى السياحة في التشيك، سيكون لديكم وقت حر للتجول في ساحة البلدة القديمة، والاستمتاع بالأجواء المحلية.</p>\n<!-- /wp:paragraph -->"
        },
        {
            "title": "السياحة في التشيك",
            "content": "<!-- wp:paragraph -->\n<p>اليوم نخصصه لاستكشاف براغ، حيث نبدأ بزيارة قلعة براغ و جسر تشارلز و برج الساعة. نختتم اليوم برحلة بالقارب في نهر مولدافا، مع وقت حر في المساء للتسوق وتناول العشاء في وسط المدينة التاريخي.</p>\n<!-- /wp:paragraph -->"
        },
        {
            "title": " براغ – بيلسن – روتمبورغ – فرانكفورت",
            "content": "<!-- wp:paragraph -->\n<p>مغادرة براغ شمالًا عبر الطريق الرومانسي، مع توقف في بيلسن و روتمبرغ للاستمتاع بالمناظر التاريخية والتجول في أجمل القرى الألمانية. في نهاية اليوم، نصل إلى فرانكفورت.</p>\n<!-- /wp:paragraph -->"
        },
        {
            "title": "فرانكفورت – الراين – كولون – أمستردام",
            "content": "<!-- wp:paragraph -->\n<p>نغادر فرانكفورت باتجاه أمستردام، مع توقف في كولون وقضاء وقت حر في المدينة. مساءً، نصل إلى أمستردام، عاصمة هولندا سياحة.</p>\n<!-- /wp:paragraph -->"
        },
        {
            "title": "جولة مدينة أمستردام",
            "content": "<!-- wp:paragraph -->\n<p>نبدأ اليوم بزيارة زانسي شانس لمشاهدة الطواحين الشهيرة، ثم ننتقل إلى فولندام و ماركن عبر رحلة بالقارب. في المساء، نقوم بزيارة بانورامية لمدينة أمستردام مع إطلالة على منطقة الأضواء الحمراء.</p>\n<!-- /wp:paragraph -->"
        },
        {
            "title": "نهاية الرحلة",
            "content": "<!-- wp:paragraph -->\n<p>بعد تناول وجبة الإفطار، تنتهي خدماتنا لهذه الرحلة الرائعة التي جمعت بين السياحة في المجر، السياحة في التشيك، هولندا سياحة، و مدن النمسا السياحية.</p>\n<!-- /wp:paragraph -->"
        }
    ],
    "faqs": [],
    "is_featured": false,
    "featured_image": {},
    "_links": {
        "self": [
            {
                "href": "https://madaratalkon.com/wp-json/wp/v2/trip/18766",
                "targetHints": {
                    "allow": [
                        "GET"
                    ]
                }
            }
        ],
        "collection": [
            {
                "href": "https://madaratalkon.com/wp-json/wp/v2/trip"
            }
        ],
        "about": [
            {
                "href": "https://madaratalkon.com/wp-json/wp/v2/types/trip"
            }
        ],
        "author": [
            {
                "embeddable": true,
                "href": "https://madaratalkon.com/wp-json/wp/v2/users/15"
            }
        ],
        "replies": [
            {
                "embeddable": true,
                "href": "https://madaratalkon.com/wp-json/wp/v2/comments?post=18766"
            }
        ],
        "version-history": [
            {
                "count": 1,
                "href": "https://madaratalkon.com/wp-json/wp/v2/trip/18766/revisions"
            }
        ],
        "predecessor-version": [
            {
                "id": 18767,
                "href": "https://madaratalkon.com/wp-json/wp/v2/trip/18766/revisions/18767"
            }
        ],
        "wp:attachment": [
            {
                "href": "https://madaratalkon.com/wp-json/wp/v2/media?parent=18766"
            }
        ],
        "wp:term": [
            {
                "taxonomy": "destination",
                "embeddable": true,
                "href": "https://madaratalkon.com/wp-json/wp/v2/destination?post=18766"
            },
            {
                "taxonomy": "trip_types",
                "embeddable": true,
                "href": "https://madaratalkon.com/wp-json/wp/v2/trip_types?post=18766"
            },
            {
                "taxonomy": "trip_tag",
                "embeddable": true,
                "href": "https://madaratalkon.com/wp-json/wp/v2/trip_tag?post=18766"
            }
        ],
        "curies": [
            {
                "name": "wp",
                "href": "https://api.w.org/{rel}",
                "templated": true
            }
        ]
    }
}