import dayjs from 'dayjs';
import ru from 'dayjs/locale/ru';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { CalendarDay, PainRecord } from '../types/types.ts';
import { IndicatorColor } from '../components/Indicator/Indicator.tsx';
import { HeadacheVariants } from '../components/CreateForm/types/radioOptions.ts';

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

dayjs.locale(ru);

export const daysOfWeekFull = [
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
    'Воскресение',
];

export const daysOfWeekShort = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export function getMonthName(month: number) {
    return dayjs()
        .month(month - 1)
        .format('MMMM');
}

export function isToday(date: dayjs.Dayjs) {
    return date.isSame(dayjs(), 'day');
}

export function getCurrentYear() {
    return dayjs().year();
}

export function getCurrentMonth() {
    return dayjs().month() + 1;
}

export function getNumberOfDaysInMonth(year: number, month: number) {
    return dayjs(`${year}-${month}-01`).daysInMonth();
}

export function createDaysForCurrentMonth(
    year: number,
    month: number,
): CalendarDay[] {
    const res: CalendarDay[] = [];
    for (let i = 0; i < getNumberOfDaysInMonth(year, month); i++) {
        const currentDate = dayjs(`${year}-${month}-${i + 1}`);

        res.push({
            date: currentDate.format('YYYY-MM-DD'),
            dayOfMonth: i + 1,
            isCurrentMonth: true,
            isToday: isToday(currentDate),
        });
    }

    return res;
}

export function createDaysForPreviousMonth(
    year: number,
    month: number,
    currentMonthDays: CalendarDay[],
): CalendarDay[] {
    const firstDayOfTheMonthWeekday = getWeekday(currentMonthDays[0].date);
    const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, 'month');

    const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday;

    const previousMonthLastMondayDayOfMonth = dayjs(currentMonthDays[0].date)
        .subtract(visibleNumberOfDaysFromPreviousMonth, 'day')
        .date();

    const res: CalendarDay[] = [];

    for (let i = 0; i < visibleNumberOfDaysFromPreviousMonth; i++) {
        res.push({
            date: dayjs(
                `${previousMonth.year()}-${previousMonth.month() + 1}-${
                    previousMonthLastMondayDayOfMonth + i
                }`,
            ).format('YYYY-MM-DD'),
            dayOfMonth: previousMonthLastMondayDayOfMonth + i,
            isCurrentMonth: false,
        });
    }

    return res;
}

export function createDaysForNextMonth(
    year: number,
    month: number,
    currentMonthDays: CalendarDay[],
): CalendarDay[] {
    const lastDayOfTheMonthWeekday = getWeekday(
        `${year}-${month}-${currentMonthDays.length}`,
    );
    const nextMonth = dayjs(`${year}-${month}-01`).add(1, 'month');
    const visibleNumberOfDaysFromNextMonth = 6 - lastDayOfTheMonthWeekday;

    const res: CalendarDay[] = [];

    for (let i = 0; i < visibleNumberOfDaysFromNextMonth; i++) {
        res.push({
            date: dayjs(
                `${nextMonth.year()}-${nextMonth.month() + 1}-${i + 1}`,
            ).format('YYYY-MM-DD'),
            dayOfMonth: i + 1,
            isCurrentMonth: false,
            isNextMonth: true,
        });
    }

    return res;
}

export function createCurrentMonthDays(year: number, month: number) {
    const currentMonthDays = createDaysForCurrentMonth(year, month);
    const previousMonthDays = createDaysForPreviousMonth(
        year,
        month,
        currentMonthDays,
    );
    const nextMonthDays = createDaysForNextMonth(year, month, currentMonthDays);

    return [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
}

export function formatDate(dateString: string) {
    return dayjs(dateString).format('DD.MM.YYYY');
}

export function getWeekday(dateString: string) {
    return dayjs(dateString).weekday();
}

export function getIndicatorColor(record: PainRecord): IndicatorColor {
    switch (record.headache) {
        case HeadacheVariants.Yes:
            return 'red';

        case HeadacheVariants.No:
            return 'green';

        default:
            return 'gray';
    }
}
