import React, { useEffect, useState } from 'react';
//import './main.css';
import { useDispatch, useSelector } from 'react-redux';

import VacancyList from './vacancy/VacancyList';
import { fetchVacancyIds } from '../../reducers/hhReduser';

const Main = () => {
    const [page, setPage] = useState(0);
    const [vacancyPage, setVacancyPage] = useState(1);

    const dispatch = useDispatch();
    const state = useSelector((state) => state.hhReducer);

    useEffect(async () => {
        dispatch(fetchVacancyIds(page));
    }, [page]);

    //  if (state.status === 'resolved' && page < 5) setPage(page + 1);
    console.log(state.status);

    return (
        <div>
            {state.status === 'resolved' && (
                <VacancyList vacancyPage={vacancyPage} />
            )}
        </div>
    );
};

export default Main;
