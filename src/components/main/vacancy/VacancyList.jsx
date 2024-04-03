import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { parseVacancy } from '../../../reducers/hhReduser';
import Vacancy from './Vacancy';
import '../main.css';

const VacancyList = ({ vacancyPage }) => {
    const [count, setCount] = useState(0);
    const dispatch = useDispatch();

    const start = (vacancyPage - 1) * 20;
    const end = start + 20;

    const vacancies = useSelector((state) => {
        const temp = state.hhReducer.vacancies;
        console.log('STATE', state);
        return temp.slice(start, end);
    });

    //console.log(vacancies[count]);

    useEffect(() => {
        dispatch(parseVacancy(vacancies[count]));
    }, [count]);

    console.log(vacancies[count].load);
    if (vacancies[count].load && count < 19) setCount(count + 1);

    return (
        <div className="container">
            {vacancies.map((vacancy) => (
                <Vacancy key={vacancy.id} vacancy={vacancy} />
            ))}
        </div>
    );
};

export default VacancyList;
