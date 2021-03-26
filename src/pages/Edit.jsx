import React from "react";
import { useParams, useLocation } from "react-router-dom";

import EditQuestion from "../components/EditQuestion";
import NotFound from "../components/NotFound";

export default function Edit() {
  const { id } = useParams();
  const { state } = useLocation();

  return (
    <div>
      <>
        {state?.category && state?.type && id
          ? (
            <EditQuestion category={state.category} type={state.type} id={id} />
          )
          : <NotFound />}
      </>
    </div>
  );
}
