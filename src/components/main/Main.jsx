import React, { useEffect, useState } from 'react';
import './main.css';
import { useDispatch, useSelector } from 'react-redux';

import VacancyList from './vacancy/VacancyList';
import { parseVacancy } from '../../reducers/hhReduser';
import { createItem } from '../actions/vacancies';

const Main = () => {
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(null);
    const [countAll, setCountAll] = useState(0);
    const [vacancyPage, setVacancyPage] = useState(1);
    const [vacancyArray, setVacancyArray] = useState([]);

    const dispatch = useDispatch();
    const state = useSelector((state) => state.hhReducer);

    const handleNext = () => {
        setVacancyPage(vacancyPage + 1);
    };
    const handlePrev = () => {
        setVacancyPage(vacancyPage - 1);
    };

    useEffect(() => {
        const getListVacancies = async (page) => {
            const reg = /"userLabelsForVacancies":{.+?}/;
            const response = await fetch(
                `https://krasnoyarsk.hh.ru/vacancy?search_field=name&search_field=company_name&search_field=description&enable_snippets=false&schedule=remote&professional_role=156&professional_role=160&professional_role=10&professional_role=12&professional_role=150&professional_role=25&professional_role=165&professional_role=34&professional_role=36&professional_role=73&professional_role=155&professional_role=96&professional_role=164&professional_role=104&professional_role=157&professional_role=107&professional_role=112&professional_role=113&professional_role=148&professional_role=114&professional_role=116&professional_role=121&professional_role=124&professional_role=125&professional_role=126&page=${page}`
            );
            const data = await response.text();
            const result = data
                .match(reg)[0]
                .replace('"userLabelsForVacancies":', '');
            console.log('IN FUNC', Object.keys(JSON.parse(result)));
            return createItem(Object.keys(JSON.parse(result)), count);
        };
        getListVacancies(page).then((res) => {
            setVacancyArray((prev) => {
                //console.log('SET ARRAY', prev.length);
                prev.length = 0;
                return [...prev, ...res];
            });
            setCount((prev) => (prev = 0));
            // console.log('IN PROMISE', count, vacancyArray.length);
        });
    }, [page]);

    useEffect(() => {
        //console.log('IN USEEFFECT', count, vacancyArray.length);
        if (vacancyArray[count]) dispatch(parseVacancy(vacancyArray[count]));
    }, [count]);

    if (state.vacancies[countAll]?.load) {
        setCount(count + 1);
        setCountAll(countAll + 1);
    }

    if (state.vacancies[countAll]?.error) {
        console.log('ERROR - VACANCY NOT PARSED');
        setCount(count + 1);
        setCountAll(countAll + 1);
    }

    if (state.vacancies.length && count === vacancyArray.length) {
        setPage(page + 1);
        setVacancyArray([]);
    }

    return (
        <div>
            {state.vacancies.length && (
                <VacancyList vacancyPage={vacancyPage} />
            )}
            <div className="page-count">
                {`${vacancyPage} / ${Math.round(countAll / 20) + 1}`}
            </div>
            <div className="prev-page" onClick={handlePrev}>
                {'<'}
            </div>
            <div className="next-page" onClick={handleNext}>
                {'>'}
            </div>
        </div>
    );
};

export default Main;
