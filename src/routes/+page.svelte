<script lang="ts">
    import { SESSION_DATA, type DayName, type Venue } from "$lib/session-data";

    type DaySchedule = {
        isoDate: string;
        label: string;
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

    const DAY_LABEL_FORMATTER = new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "short",
    });

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

    function isWeekday(dayName: string): dayName is DayName {
        return WEEKDAY_ORDER.includes(dayName as DayName);
    }

    function buildHolidayWeekdays(year: number): Date[] {
        const days: Date[] = [];
        const start = new Date(year, 5, 1);
        const end = new Date(year, 5, 12);

        for (
            const date = new Date(start);
            date <= end;
            date.setDate(date.getDate() + 1)
        ) {
            const dayName = new Intl.DateTimeFormat("en-US", {
                weekday: "long",
            }).format(date);
            if (isWeekday(dayName)) {
                days.push(new Date(date));
            }
        }

        return days;
    }

    function buildSchedule(
        venues: Record<string, Venue>,
        year: number,
    ): DaySchedule[] {
        const holidayDays = buildHolidayWeekdays(year);

        return holidayDays.map((date) => {
            const dayName = new Intl.DateTimeFormat("en-US", {
                weekday: "long",
            }).format(date) as DayName;
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
                isoDate: date.toISOString().slice(0, 10),
                label: DAY_LABEL_FORMATTER.format(date),
                dayName,
                venues: dayVenues,
            };
        });
    }

    const year = new Date().getFullYear();
    const schedule = buildSchedule(SESSION_DATA.venues, year);
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
        <h1>Weekday Sessions: 1 Jun to 12 Jun {year}</h1>
        <p class="lead">
            Find the available venues and session times for each weekday in the
            two-week holiday window.
        </p>
    </header>

    <section class="layout-card" aria-label="Sessions by day">
        {#each schedule as day (day.isoDate)}
            <article class="card day-card stack" style="--gap: 0.7rem;">
                <header class="stack" style="--gap: 0.25rem;">
                    <h2 class="fs-l">{day.label}</h2>
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
                                        rel="noreferrer noopener"
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
