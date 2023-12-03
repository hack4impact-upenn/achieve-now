/**
 * A file that contains all the components and logic for the table of users
 * in the AdminDashboardPage.
 */
import React from 'react';
import { CircularProgress, Checkbox, Button } from '@mui/material/';
import { CallMade } from '@mui/icons-material';
import { PaginationTable, TColumn } from '../components/PaginationTable';

interface IResource {
  _id: string;
  title: string;
  description: string;
  type: string;
  link: string;
}

interface IRow extends IResource {
  isChecked: boolean;
}

interface ResourceRow {
  key: string;
  selection: React.ReactElement;
  title: string;
  description: string;
  type: string;
  link: React.ReactElement;
}

interface ResourceTableProps {
  allResources: IRow[];
  handleCheckboxChange: (id: string) => void;
}

interface CheckBoxProps {
  id: string;
  checked: boolean;
  handleChange: (id: string) => void;
}

function CheckBox({ id, checked, handleChange }: CheckBoxProps) {
  return (
    <Checkbox
      id={id}
      checked={checked}
      onChange={(event) => handleChange(event.target.id)}
    />
  );
}

function ResourceButton({ link }: { link: string }) {
  return (
    <Button
      variant="contained"
      endIcon={<CallMade />}
      onClick={() => {
        const newWindow = window.open(link, '_blank', 'noopener,noreferrer');
        if (newWindow) {
          newWindow.opener = null;
        }
      }}
    >
      View Resource
    </Button>
  );
}

function ResourceTable({
  allResources,
  handleCheckboxChange,
}: ResourceTableProps) {
  // define columns for the table
  const columns: TColumn[] = [
    { id: 'selection', label: 'Include Resource' },
    { id: 'title', label: 'Title' },
    { id: 'description', label: 'Description' },
    { id: 'type', label: 'Type' },
    { id: 'link', label: 'Link' },
  ];

  // Used to create the data type to create a row in the table
  function createResourceRow(
    resource: IResource,
    checkBox: React.ReactElement,
    linkButton: React.ReactElement,
  ): ResourceRow {
    const { _id, title, description, type } = resource;
    return {
      key: _id,
      selection: checkBox,
      title,
      description,
      type,
      link: linkButton,
    };
  }

  // if the allResources is not yet populated, display a loading spinner
  if (!allResources || allResources.length === 0) {
    return (
      <div
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '200px',
        }}
      >
        <div
          style={{
            margin: 'auto',
            width: '80px',
            height: '80px',
            marginTop: '60px',
            marginBottom: '60px',
          }}
        >
          <CircularProgress size={80} />
        </div>
      </div>
    );
  }
  return (
    <PaginationTable
      rows={allResources.map((resource: IRow) => {
        return createResourceRow(
          resource,
          <CheckBox
            // eslint-disable-next-line no-underscore-dangle
            id={resource._id}
            checked={resource.isChecked}
            // eslint-disable-next-line no-underscore-dangle
            handleChange={() => handleCheckboxChange(resource._id)}
          />,
          <ResourceButton link={resource.link} />,
        );
      })}
      columns={columns}
    />
  );
}

export default ResourceTable;
