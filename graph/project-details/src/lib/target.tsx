/* eslint-disable @nx/enforce-module-boundaries */
// nx-ignore-next-line
import { TargetConfiguration } from '@nx/devkit';
import PropertyRenderer from './property-renderer';
import { useState } from 'react';
import {
  getExternalApiService,
  useEnvironmentConfig,
  useRouteConstructor,
} from '@nx/graph/shared';
import { EyeIcon, PlayIcon } from '@heroicons/react/24/outline';
import { To, useNavigate, useSearchParams } from 'react-router-dom';

/* eslint-disable-next-line */
export interface TargetProps {
  projectName: string;
  targetName: string;
  targetConfiguration: TargetConfiguration;
  sourceMap: Record<string, string[]>;
}

export function Target(props: TargetProps) {
  const { environment } = useEnvironmentConfig();
  const externalApiService = getExternalApiService();
  const navigate = useNavigate();
  const routeContructor = useRouteConstructor();
  // const [searchParams, setSearchParams] = useSearchParams();

  const runTarget = () => {
    externalApiService.postEvent({
      type: 'run-task',
      payload: { taskId: `${props.projectName}:${props.targetName}` },
    });
  };

  const viewInTaskGraph = () => {
    if (environment === 'nx-console') {
      externalApiService.postEvent({
        type: 'open-task-graph',
        payload: {
          projectName: props.projectName,
          targetName: props.targetName,
        },
      });
    } else {
      navigate(
        routeContructor(
          {
            pathname: `/tasks/${encodeURIComponent(props.targetName)}`,
            search: `?projects=${encodeURIComponent(props.projectName)}`,
          },
          true
        )
      );
    }
  };

  return (
    <div className="ml-3 mb-3">
      <h3 className="text-lg font-bold flex">
        {props.targetName}{' '}
        {environment === 'nx-console' && (
          <PlayIcon className="h-5 w-5" onClick={runTarget} />
        )}
        <EyeIcon className="h-5 w-5" onClick={viewInTaskGraph}></EyeIcon>
      </h3>
      <div className="ml-3">
        {Object.entries(props.targetConfiguration).map(([key, value]) =>
          PropertyRenderer({
            propertyKey: key,
            propertyValue: value,
            keyPrefix: `targets.${props.targetName}`,
            sourceMap: props.sourceMap,
          })
        )}
      </div>
    </div>
  );
}

export default Target;
