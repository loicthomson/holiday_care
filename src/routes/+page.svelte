<script lang="ts">
    import { base } from "$app/paths";
    import { SESSION_DATA, type DayName, type Venue } from "$lib/session-data";

    type DaySchedule = {
        dayName: DayName;
        venues: Array<{
            id: string;
            name: string;
            address: string;
            recommended: boolean;
            times: string[];
        }>;
    };

    const WEEKDAY_ORDER: DayName[] = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
    ];

    function getStartMinutes(timeRange: string): number {
        const start = timeRange.split("-")[0]?.trim();
        if (!start) {
            return Number.MAX_SAFE_INTEGER;
        }

        const [hours, minutes] = start
            .split(":")
            .map((value) => Number.parseInt(value, 10));
        if (Number.isNaN(hours) || Number.isNaN(minutes)) {
            return Number.MAX_SAFE_INTEGER;
        }

        return hours * 60 + minutes;
    }

    function googleMapsUrl(address: string): string {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    }

    function buildSchedule(venues: Record<string, Venue>): DaySchedule[] {
        return WEEKDAY_ORDER.map((dayName) => {
            const dayVenues = Object.entries(venues)
                .map(([id, venue]) => {
                    const matchingSessions = venue.session.filter(
                        (entry) =>
                            entry.day === dayName || entry.day === "Weekdays",
                    );

                    const times = matchingSessions
                        .map((entry) => entry.time)
                        .sort(
                            (a, b) => getStartMinutes(a) - getStartMinutes(b),
                        );

                    if (times.length === 0) {
                        return null;
                    }

                    return {
                        id,
                        name: venue.name,
                        address: venue.address,
                        recommended: matchingSessions.some(
                            (entry) => entry.recommended === true,
                        ),
                        times,
                    };
                })
                .filter(
                    (venue): venue is NonNullable<typeof venue> =>
                        venue !== null,
                )
                .sort((a, b) => {
                    if (a.recommended !== b.recommended) {
                        return a.recommended ? -1 : 1;
                    }

                    const startDiff =
                        getStartMinutes(a.times[0]) -
                        getStartMinutes(b.times[0]);
                    if (startDiff !== 0) {
                        return startDiff;
                    }

                    return a.name.localeCompare(b.name);
                });

            return {
                dayName,
                venues: dayVenues,
            };
        });
    }

    const schedule = buildSchedule(SESSION_DATA.venues);
</script>

<svelte:head>
    <title>Holiday Childcare Sessions</title>
    <meta
        name="description"
        content="Weekday holiday childcare sessions from 1 June to 12 June, with venue addresses and times."
    />
</svelte:head>

<main class="layout-readable center stack page-shell" style="--gap: 1.25rem;">
    <header class="stack" style="--gap: 0.4rem;">
        <p class="eyebrow">Holiday Childcare</p>
        <h1>Weekday Sessions</h1>
        <p class="lead">
            Sessions are grouped by day of the week so repeating weeks are easier
            to scan.
        </p>
    </header>

    <section class="layout-card" aria-label="Sessions by day">
        {#each schedule as day (day.dayName)}
            <article class="card day-card stack" style="--gap: 0.7rem;">
                <header class="stack" style="--gap: 0.25rem;">
                    <h2 class="fs-l">{day.dayName}</h2>
                    <p class="muted-text">
                        {day.venues.length} venue{day.venues.length === 1
                            ? ""
                            : "s"}
                    </p>
                </header>

                {#if day.venues.length === 0}
                    <p>No sessions available on this day.</p>
                {:else}
                    <ul class="stack venue-list" style="--gap: 0.75rem;">
                        {#each day.venues as venue (venue.id)}
                            <li
                                class={["card venue-item stack", venue.recommended && "recommended-venue"]}
                                style="--gap: 0.4rem;"
                            >
                                <h3 class="fs-m">{venue.name}</h3>
                                <p>{venue.address}</p>
                                <p>
                                    <a
                                        href={googleMapsUrl(venue.address)}
                                        target="_blank"
                                        rel="noreferrer noopener external"
                                        >View on Google Maps</a
                                    >
                                </p>
                                <div class="cluster" style="--gap: 0.5rem;">
                                    {#each venue.times as time (time)}
                                        <span class="tag info">{time}</span>
                                    {/each}
                                </div>
                            </li>
                        {/each}
                    </ul>
                {/if}
            </article>
        {/each}
    </section>
</main>
