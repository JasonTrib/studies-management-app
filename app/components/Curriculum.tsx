import { Form, useTransition } from "@remix-run/react";
import _ from "lodash";
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CogIcon from "~/components/icons/CogIcon";
import type { curriculumDataT, studiesCoursesDataT } from "~/data/data";
import ActionButton from "./buttons/ActionButton";

type CurriculumT = {
  title: string;
  coursesData: studiesCoursesDataT;
  curriculumData: curriculumDataT;
  variant: string;
  showAction: boolean;
};

const Curriculum: FC<CurriculumT> = ({
  title,
  coursesData,
  curriculumData,
  variant,
  showAction,
}) => {
  const transition = useTransition();
  const isBusy = transition.state !== "idle";
  const [isEditing, setIsEditing] = useState(false);
  const hasLoaded = useRef(false);
  const classPale = isEditing ? "pale" : "";
  const compulsories = coursesData.map((x) => x.semester.compulsories);
  const electivesAvailable = coursesData.map((x) => x.semester.electives);
  const curriculumElectives = curriculumData.map((x) => x.semester.electives);
  const electives = electivesAvailable.map(
    (electives, i) => _.min([electives, curriculumElectives[i]]) || 0,
  );
  const sum = compulsories.map((x, i) => x + electives[i]);
  const sumArray = (arr: Array<number>) => arr.reduce((prev, curr) => prev + curr, 0);

  const renderData = (arr: Array<number>) => arr.map((x, i) => <td key={`${i}:${x}`}>{x}</td>);

  useEffect(() => {
    if (transition.state === "loading") {
      hasLoaded.current = true;
    }
    if (hasLoaded && transition.state === "idle") {
      hasLoaded.current = false;
      setIsEditing(false);
    }
  }, [transition.state]);

  return (
    <div className="curriculum-container">
      <Form method="post" action={`edit`}>
        <div className="heading">
          <h3>{title}</h3>
          <div className="actions">
            {showAction &&
              (isEditing ? (
                <>
                  <ActionButton
                    className="action-btn"
                    disabled={isBusy}
                    variant="primary"
                    type="submit"
                  >
                    SUBMIT
                  </ActionButton>
                  <ActionButton
                    className="action-btn"
                    onClick={() => setIsEditing(false)}
                    variant="cancel"
                  >
                    CANCEL
                  </ActionButton>
                </>
              ) : (
                <div className="svg-btn" onClick={() => setIsEditing(true)}>
                  <CogIcon />
                </div>
              ))}
          </div>
        </div>
        <div className="content">
          <div className="body">
            <div className="mr-12">
              <table>
                <thead>
                  <tr>
                    <th className="text-start">Semester</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-start">Compulsories</td>
                  </tr>
                  <tr>
                    <td className="text-start">Electives</td>
                  </tr>
                  <tr>
                    <td className="text-start">
                      <b>Sum</b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mr-12">
              <table>
                <colgroup>
                  {coursesData.map(() => (
                    <col key={uuidv4()} className="col-small" />
                  ))}
                </colgroup>
                <thead>
                  <tr>
                    {coursesData.map((_, i) => (
                      <th key={uuidv4()}>{i + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>{renderData(compulsories)}</tr>
                  {isEditing ? (
                    <tr className="highlight">
                      {electives.map((num, i) => (
                        <td key={uuidv4()}>
                          <input
                            id={`sem${i + 1}`}
                            name={`sem${i + 1}`}
                            disabled={isBusy}
                            defaultValue={num}
                            placeholder={`${num}`}
                            type="number"
                            min={0}
                            max={electivesAvailable[i]}
                          />
                        </td>
                      ))}
                    </tr>
                  ) : (
                    <tr>{renderData(electives)}</tr>
                  )}
                  <tr className={`${classPale}`}>
                    {sum.map((num) => (
                      <td key={uuidv4()}>
                        <b>{num}</b>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{sumArray(compulsories)}</td>
                  </tr>
                  <tr className={`${classPale}`}>
                    <td>{sumArray(electives)}</td>
                  </tr>
                  <tr className={`${classPale}`}>
                    <td>
                      <b>{sumArray(sum)}</b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="form-reset">
              <input type="hidden" id="_action" name="_action" value={variant} />
              {isEditing && (
                <button type="reset" disabled={isBusy}>
                  RESET
                </button>
              )}
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Curriculum;
