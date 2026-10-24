import React from "react";
import { useParams } from 'react-router-dom';
import { useSeoMeta } from '@unhead/react';
import CenteredTemplate from "../Component/Commons/CenteredTemplate";
import ViewTrip from "../Component/Trips/ViewTrip";
import ViewPlace from "../Component/Places/ViewPlace";
import ViewUser from "../Component/Users/ViewUser";

export default function View() {
    //Module to show the search page
    const { opt } = useParams();

    const titleMap: Record<string, string> = { Trip: 'View Trip', Place: 'View Place', User: 'View User' };
    const pageTitle = `${titleMap[opt ?? ''] ?? 'View'} - AdondeVamos`;
    useSeoMeta({ title: pageTitle, ogTitle: pageTitle });

    const controlViewOption = (opt) => {
        if (opt === "Trip") {
            return <>
                <ViewTrip />
            </>;
        }
        if (opt === "Place") {
            return <>
                <ViewPlace />
            </>;
        }
        if (opt === "User") {
            return <>
                <ViewUser />
            </>;
        }
    }

    return (
        <CenteredTemplate>
            <>
                {controlViewOption(opt)}
            </>
        </CenteredTemplate>
    );
}