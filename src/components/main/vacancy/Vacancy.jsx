import React from 'react';
import './vacancy.css';

const Vacancy = ({ vacancy }) => {
    const { load, flag, id, text, skills } = vacancy;

    const vacancyTitle = text.match(
        /(?<title>.+?) в компании.+?Зарплата: (?<price>[^.]+)(?<tail>.+)\./
    );
    //console.log(vacancyTitle);
    const vacancyTail = vacancyTitle?.groups.tail.replaceAll('.', '\n') || '';
    let vacancyHeader = vacancyTitle?.groups.title || '';
    if (vacancyHeader.length > 50)
        vacancyHeader = vacancyHeader.slice(0, 50) + '...';

    //console.log(vacancyHeader);

    return (
        <div
            className="job"
            onClick={() =>
                window.open(`https://krasnoyarsk.hh.ru/vacancy/${id}`, '_blank')
            }
        >
            <div className="job__header">{vacancyHeader}</div>
            <div className="job__price">{vacancyTitle?.groups.price}</div>
            <div className="job__tail">{`${vacancyTail}`}</div>
        </div>
    );
};

export default Vacancy;
