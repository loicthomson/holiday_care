export type DayName = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export type Session = {
    day: DayName | 'Weekdays';
    time: string;
    recommended?: boolean;
};

export type Venue = {
    name: string;
    address: string;
    session: Session[];
};

export type SessionData = {
    venues: Record<string, Venue>;
};

export const SESSION_DATA: SessionData = {
    venues: {
        hampden: {
            name: "Hampden Children's Centre",
            address: '80 Polygon Road, London NW1 1HQ',
            session: [{ day: 'Tuesday', time: '10:00 - 12:00', recommended: true }]
        },
        agar: {
            name: "Agar Children's Centre and Family Hub",
            address: 'Wrotham Road, London NW1 9SU',
            session: [{ day: 'Thursday', time: '09:30 - 11:30', recommended: true }]
        },
        regentsPark: {
            name: "Regent's Park Children's Centre and Family Hub",
            address: 'Augustus Street, London NW1 3TJ',
            session: [
                { day: 'Monday', time: '09:30 - 11:30' },
                { day: 'Wednesday', time: '09:30 - 11:30' }
            ]
        },
        harmood: {
            name: "Harmood Children's Centre and Family Hub",
            address: '1 Forge Place, London NW1 8DQ',
            session: [
                { day: 'Monday', time: '13:30 - 15:00', recommended: true },
                { day: 'Thursday', time: '09:30 - 11:30' }
            ]
        },
        kilburnGrange: {
            name: "Kilburn Grange Children's Centre and Family Hub",
            address: '1 Palmerston Road, London NW6 2JL',
            session: [{ day: 'Wednesday', time: '09:30 - 11:30' }]
        },
        littleHaven: {
            name: 'Little Haven',
            address: 'Kings House, 242 Pentonville Road, London N1 9JY',
            session: [{ day: 'Monday', time: '10:00 - 11:30', recommended: true }]
        },
        shoeLane: {
            name: 'Shoe Lane Library',
            address: '1 Little New St, London EC4A 3JR',
            session: [{ day: 'Weekdays', time: '09:30 - 17:30' }]
        },
        stPancras: {
            name: "St Pancras Library",
            address: '5 Pancras Square, London N1C 4AG',
            session: [{ day: 'Weekdays', time: '08:00 - 20:00' }]
        },
        oneOClock: {
            name: "One O'Clock club",
            address: 'Peggy Jay Centre, Parliament Hill Fields, Highgate Road, London NW5 1QR',
            session: [{ day: 'Weekdays', time: '13:00 - 15:00' }]
        },
        coramFields: {
            name: "Coram Fields",
            address: '93 Guilford Street, London WC1N 1DN',
            session: [{ day: 'Weekdays', time: '9:30 - 12:30' }]
        }
    }
};
