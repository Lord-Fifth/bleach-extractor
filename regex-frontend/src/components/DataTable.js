import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

function DataTable({ data }) {
  if (!data || data.length === 0) return null;

  const columns = Object.keys(data[0]);
  const dataIsLimited = data.length === 5;

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column}>{column}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column}>{row[column]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {dataIsLimited && (
        <Typography variant="caption" color="textSecondary">
          Showing first 5 rows of data
        </Typography>
      )}
    </>
  );
}

export default DataTable;
