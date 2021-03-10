const formmatDate = (date: string): string => {
    const dateFormmated = new Date(date);
    const day = dateFormmated.getDate() > 9
        ? dateFormmated.getDate() : `0${dateFormmated.getDate()}`;
    const month = dateFormmated.getMonth() + 1 > 9
        ? dateFormmated.getMonth() + 1 : `0${dateFormmated.getMonth() + 1}`;
    const year = dateFormmated.getFullYear();

    return `${day}/${month}/${year}`;
}

export default formmatDate;