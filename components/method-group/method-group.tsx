/* eslint-disable react-hooks/exhaustive-deps */
/*
  eslint-disable
  default-case,
  jsx-a11y/no-static-element-interactions,
  jsx-a11y/click-events-have-key-events
 */

import { setUser } from '@/store/config-slice';
import { useAppSelector } from '@/store/hooks';
import store from '@/store/store';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, {
  cloneElement,
  createContext,
  type Dispatch,
  type FC,
  type PropsWithChildren,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useFilter, useHash } from 'usable-react';
import styles from './method-group.module.css';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

// --- Method Configuration Types

interface MethodComplexArg<T extends string | number | boolean> {
  name: string;
  default: T;
  fallbackGlobalStateKey?: string;
  type: 'json';
}

interface MethodPrimitiveArg<T extends string | number | boolean> {
  name: string;
  default: T;
  fallbackGlobalStateKey?: string;
}

type MethodStringArg = MethodPrimitiveArg<string>;
type MethodNumberArg = MethodPrimitiveArg<number>;
type MethodBooleanArg = MethodPrimitiveArg<boolean>;

interface MethodEnumArg {
  name: string;
  options: (string | number)[];
}

type MethodArgType =
  | MethodEnumArg
  | MethodPrimitiveArg<any>
  | MethodComplexArg<any>;

type DefaultPreset = { values: any[]; name: string };
export interface MethodConfig {
  name: string;
  description?: string;
  func: ((...args: any[]) => void) | ((...args: any[]) => Promise<void>);
  args?: MethodArgType[];
  isAdminMethod?: boolean;
  defaultPresets?: DefaultPreset[];
}

// --- Method Hooks & Components

interface ArgProps<
  T extends
    | MethodEnumArg
    | MethodBooleanArg
    | MethodNumberArg
    | MethodStringArg,
> {
  arg: T;
  index: number;
}

const argContext = createContext<{
  args: any[];
  setArgs: Dispatch<SetStateAction<any[]>>;
}>({
  args: [],
  setArgs: () => {},
});
const ArgProvider: FC<PropsWithChildren<{ args: any[] }>> = ({
  children,
  args,
}) => {
  const [argsInner, setArgs] = useState<any[]>(args);

  return (
    <argContext.Provider value={{ args: argsInner, setArgs }}>
      {children}
    </argContext.Provider>
  );
};

function useArg<T extends string | number | boolean>(
  defaultValue: T,
  index: number,
  fallbackGlobalStateKey?: string,
) {
  const { email, phoneNumber, genericRpcMethodName, genericRpcMethodParams } =
    useAppSelector((state) => state.Config);

  let overrideValue = defaultValue;
  if (fallbackGlobalStateKey === 'email') {
    overrideValue = email as any;
  } else if (fallbackGlobalStateKey === 'phoneNumber') {
    overrideValue = phoneNumber as any;
  } else if (fallbackGlobalStateKey === 'genericRpcMethodName') {
    overrideValue = genericRpcMethodName as any;
  } else if (fallbackGlobalStateKey === 'genericRpcMethodParams') {
    overrideValue = genericRpcMethodParams as any;
  }

  const { args, setArgs } = useContext(argContext);

  useEffect(() => {
    const newArgs = [...args];
    newArgs.splice(index, 1, overrideValue);
    setArgs(newArgs);
  }, []);

  const handleSetValue = (value: any) => {
    const newArgs = [...args];
    newArgs.splice(index, 1, value);
    setArgs(newArgs);
  };

  return [args[index], handleSetValue] as const;
}

/** Renders a row into the arguments table. */
const ArgRow: React.FC<{
  name: string;
  type: string;
  inputEl: JSX.Element;
}> = ({ name, type, inputEl }) => {
  return (
    <TableRow data-test-id={name}>
      <TableCell>{name}</TableCell>
      <TableCell>{type}</TableCell>
      <TableCell>{inputEl}</TableCell>
    </TableRow>
  );
};

/** Renders a text area argument type. */
const JsonArg: React.FC<ArgProps<MethodStringArg>> = ({ arg, index }) => {
  const [value, setValue] = useArg(
    arg.default,
    index,
    arg.fallbackGlobalStateKey,
  );

  const [isExpanded, setIsExpanded] = useState(false);

  const prettifyValue = () => {
    try {
      const prettyJson = JSON.stringify(JSON.parse(value), null, 4); // 4 spaces for indentation
      return prettyJson;
    } catch {
      return value;
    }
  };

  if (isExpanded) {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/70 z-[999] grid_rows_[1fr_150px] p-24 pointer-events-auto">
        <div className="flex justify-center items-center w-full h-full">
          <CodeMirror
            value={prettifyValue()}
            placeholder="{}"
            onChange={(val: string) => setValue(val)}
            theme={vscodeDark}
            style={{
              fontSize: '14px',
              width: '100%',
              height: '100%',
              padding: '15px',
              backgroundColor: '#1e1e1e',
              overflowY: 'scroll',
              fontFamily:
                'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
            }}
            extensions={[json()]}
          />
        </div>
        <div className="flex justify-center items-center p-8">
          <button
            className="bg-white px-8 py-2 rounded-lg hover:bg-gray-300 hover:scale-[1.05]"
            onClick={() => setIsExpanded(false)}
          >
            Collapse
          </button>
        </div>
      </div>
    );
  }

  return (
    <ArgRow
      name={arg.name}
      type="String"
      inputEl={
        <div className="flex flex-col">
          <CodeMirror
            value={prettifyValue()}
            placeholder="{}"
            onChange={(val: string) => setValue(val)}
            theme={vscodeDark}
            style={{
              fontSize: '14px',
              width: '100%',
              maxWidth: '400px',
              minWidth: '400px',
              maxHeight: '250px',
              padding: '15px',
              backgroundColor: '#1e1e1e',
              overflowY: 'scroll',
              fontFamily:
                'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
            }}
            extensions={[json()]}
          />
          <div className="flex ">
            <button
              className="py-2 rounded-lg hover:scale-[1.05]"
              onClick={() => setIsExpanded(true)}
            >
              Expand
            </button>
          </div>
        </div>
      }
    />
  );
};
/** Renders a string argument type. */
const StringArg: React.FC<ArgProps<MethodStringArg>> = ({ arg, index }) => {
  const [value, setValue] = useArg(
    arg.default,
    index,
    arg.fallbackGlobalStateKey,
  );

  return (
    <ArgRow
      name={arg.name}
      type="String"
      inputEl={
        <input
          type="text"
          style={{ color: 'black', padding: '4px' }}
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
      }
    />
  );
};

/** Renders a number arugment type. */
const NumberArg: React.FC<ArgProps<MethodNumberArg>> = ({ arg, index }) => {
  const [value, setValue] = useArg(arg.default, index);
  return (
    <ArgRow
      name={arg.name}
      type="Number"
      inputEl={
        <input
          type="text"
          style={{ color: 'black', padding: '4px' }}
          onChange={(e) => setValue(Number(e.target.value))}
          value={value}
        />
      }
    />
  );
};

/** Renders a boolean argument type. */
const BooleanArg: React.FC<ArgProps<MethodBooleanArg>> = ({ arg, index }) => {
  const [value, setValue] = useArg(arg.default, index);
  return (
    <ArgRow
      name={arg.name}
      type="Boolean"
      inputEl={
        <input
          type="checkbox"
          onChange={(e) => setValue(e.target.checked)}
          checked={value}
        />
      }
    />
  );
};

/** Renders an enum argument type. */
const EnumArg: React.FC<ArgProps<MethodEnumArg>> = ({ arg, index }) => {
  const [, setValue] = useArg(arg.options[0], index);
  return (
    <ArgRow
      name={arg.name}
      type="Enum"
      inputEl={
        <select onChange={(e) => setValue(Number(e.target.value))}>
          {arg.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      }
    />
  );
};

/** Parses the argument types and renders a table of customizable arguments. */
const RenderArgsTable: React.FC<{
  args: MethodArgType[];
  methodArgToggle: any;
}> = ({ args, methodArgToggle }) => {
  const renderTableRow = useCallback(
    (arg: NonNullable<MethodConfig['args']>[number], index: number) => {
      // hide arg of the method if the toggle is false
      if (
        methodArgToggle !== undefined &&
        methodArgToggle?.[arg.name] !== undefined &&
        !methodArgToggle?.[arg.name]
      ) {
        return <></>;
      }

      if ((arg as MethodComplexArg<any>).type === 'json') {
        return <JsonArg arg={arg as any} index={index} />;
      }

      if (
        (arg as MethodPrimitiveArg<number | boolean>).default ||
        (arg as MethodPrimitiveArg<string>)
      ) {
        switch (typeof (arg as any).default) {
          case 'number':
            return <NumberArg arg={arg as any} index={index} />;
          case 'string':
            return <StringArg arg={arg as any} index={index} />;
          case 'boolean':
            return <BooleanArg arg={arg as any} index={index} />;
        }
      }

      return <EnumArg arg={arg as MethodEnumArg} index={index} />;
    },
    [],
  );

  const table = (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Argument</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {args.map(
            (arg: NonNullable<MethodConfig['args']>[number], index: number) =>
              cloneElement(renderTableRow(arg, index), { key: index }),
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return table;
};

const DefaultPresetSelector: FC<{
  defaultPresets: DefaultPreset[];
}> = ({ defaultPresets }) => {
  const { setArgs } = useContext(argContext);

  const handleSelectPreset = (preset: any[]) => {
    setArgs(preset);
  };

  return (
    <Stack gap={2}>
      <Typography fontSize={14} fontWeight={'bold'}>
        Arg Presets
      </Typography>
      <Stack gap={2} direction={'row'} alignItems={'center'} flexWrap={'wrap'}>
        {defaultPresets.map((preset, index) => {
          return (
            <Button
              key={`arg-preset-button-${preset.name}-${index}`}
              className={styles.muiBtn}
              onClick={() => handleSelectPreset(preset.values)}
            >
              {preset.name}
            </Button>
          );
        })}
      </Stack>
    </Stack>
  );
};

const MethodInner: FC<{
  _groupName: string;
  methodArgToggle: any;
  methods: MethodConfig[];
  _tabIndex: string;
  defaultExpanded?: boolean;
  method: MethodConfig;
}> = ({ methodArgToggle, defaultExpanded, method }) => {
  const { args } = useContext(argContext);

  const [error, setError] = useState('');
  const onExecute = async () => {
    const argsWithFallback = args.map((argValue, argIndex) => {
      const argMeta: any = method.args?.[argIndex];
      const hasGlobalFallback = !!argMeta?.fallbackGlobalStateKey;
      // no change, use fallback
      if (hasGlobalFallback && argValue === argMeta?.default) {
        return (store.getState().Config as any)[
          argMeta?.fallbackGlobalStateKey
        ];
      }
      return argValue;
    });
    try {
      setError('');
      await method.func(...argsWithFallback);
    } catch (e: any) {
      console.warn(e.message);
      setError(`${e.message}`);
      store.dispatch(setUser(null));
    }
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onExecute();
  };

  return (
    <Accordion
      data-test-id={`${method.name}-method`}
      defaultExpanded={defaultExpanded}
    >
      <AccordionSummary>
        <Typography fontWeight="600">{method.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <form onSubmit={handleFormSubmit}>
          <Stack gap={2} alignItems="start">
            {method.description && (
              <Typography>{method.description}</Typography>
            )}
            {method.defaultPresets && (
              <DefaultPresetSelector defaultPresets={method.defaultPresets} />
            )}
            {!!method.args?.length && (
              <RenderArgsTable
                args={method.args || []}
                methodArgToggle={methodArgToggle}
              />
            )}
            <Stack direction="row" justifyContent="end">
              <Button className={styles.muiBtn} onClick={onExecute}>
                Execute
              </Button>
            </Stack>
            <Typography
              fontWeight="600"
              fontSize={'14px'}
              color={(t) => t.palette.error.main}
            >
              {error}
            </Typography>
          </Stack>
        </form>
      </AccordionDetails>
    </Accordion>
  );
};

export function createMethodGroup(
  _groupName: string,
  methodArgToggle: any,
  methods: MethodConfig[],
  _tabIndex: string,
  defaultExpanded?: boolean,
) {
  const createMethod = (method: MethodConfig) => {
    const Method: FC = () => {
      return (
        <ArgProvider
          args={method.args?.map((arg) => (arg as any).default) ?? []}
        >
          <MethodInner
            _groupName={_groupName}
            methodArgToggle={methodArgToggle}
            methods={methods}
            _tabIndex={_tabIndex}
            defaultExpanded={defaultExpanded}
            method={method}
          />
        </ArgProvider>
      );
    };
    return Method;
  };

  const MethodGroup: React.FC = () => {
    const {
      filter,
      email,
      phoneNumber,
      genericRpcMethodName,
      genericRpcMethodParams,
    } = useAppSelector((state) => state.Config);

    const results = useFilter({
      needle: filter,
      haystack: methods,
      debounce: 1000,
      searchOptions: {
        keys: ['name'],
      },
    });

    const resultsHash = useHash(results);

    const methodComponents = useMemo(
      () => methods.map(createMethod),
      [email, phoneNumber, genericRpcMethodName, genericRpcMethodParams],
    );
    const filteredMethodComponents = useMemo(
      () => results.map(createMethod),
      [
        resultsHash,
        email,
        phoneNumber,
        genericRpcMethodName,
        genericRpcMethodParams,
      ],
    );
    const showList = filter ? !!filteredMethodComponents.length : true;

    return (
      <>
        {showList && (
          <Stack>
            {filter
              ? filteredMethodComponents.map((Render, i) =>
                  cloneElement(<Render />, { key: i }),
                )
              : methodComponents.map((Render, i) =>
                  cloneElement(<Render />, { key: i }),
                )}
          </Stack>
        )}
      </>
    );
  };

  return MethodGroup;
}
