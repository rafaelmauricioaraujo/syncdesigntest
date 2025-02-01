'use client';

import * as React from 'react';
import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

import { dayjs } from '@/lib/dayjs';

// Invoice data should be received as a prop.
// For the sake of simplicity, we are using a hardcoded data.

interface Address {
  AddressLine1: string;
  AddressLine2: string;
  Town: string;
  County: string;
  PostCode: string;
  Country: string;
}

function formatAddress(address: Address): string {
  if (!address) return '';

  const { AddressLine1, AddressLine2, Town, County, PostCode, Country } = address;

  // Create an array of address parts, filtering out null/empty values
  const addressParts = [AddressLine1, AddressLine2, Town, County, PostCode, Country].filter(
    (part) => part && part.trim() !== ''
  );

  // Join the parts, inserting line breaks as needed
  return addressParts
    .map((part, index) => {
      // Add a comma and space after the element if it's not the last piece and not County
      if (index < addressParts.length - 1 && part !== County) {
        return part + ', ';
      }
      return part;
    })
    .join('\n');
}

function displayDate(date: string, fallbackString: string): string {
  const actualDate = date ? new Date(date) : null;
  if (actualDate) {
    return dayjs(actualDate).format('ll');
  }
  return fallbackString;
}

export interface LineItem {
  id: string;
  name: string;
  quantity: number;
  currency: string;
  unitAmount: number;
  totalAmount: number;
}

const styles = StyleSheet.create({
  // Utils
  fontMedium: { fontWeight: 500 },
  fontSemibold: { fontWeight: 600 },
  textLg: { fontSize: 10, lineHeight: 1.5 },
  textXl: { fontSize: 18, lineHeight: 1.6 },
  textRight: { textAlign: 'right' },
  uppercase: { textTransform: 'uppercase' },
  gutterBottom: { marginBottom: 4 },
  flexGrow: { flexGrow: 1 },
  flexRow: { flexDirection: 'row' },
  flexColumn: { flexDirection: 'column' },
  w50: { width: '50%' },
  // Components
  page: { backgroundColor: '#FFFFFF', gap: 32, padding: 24, fontSize: 10, fontWeight: 400, lineHeight: 1.43 },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  brand: { height: 85, width: 80 },
  refs: { gap: 8 },
  refRow: { flexDirection: 'row' },
  refDescription: { fontWeight: 500, width: 100 },
  items: { borderWidth: 1, borderStyle: 'solid', borderColor: '#EEEEEE', borderRadius: 4 },
  itemRow: { borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: '#EEEEEE', flexDirection: 'row' },
  itemDescriptionShort: { padding: 6, width: '30%' },
  itemDescription: { padding: 6, width: '50%' },
  itemQty: { padding: 6, width: '10%' },
  itemUnitAmount: { padding: 6, width: '15%' },
  itemTotalAmount: { padding: 6, width: '15%' },
  summaryRow: { flexDirection: 'row' },
  summaryGap: { padding: 6, width: '70%' },
  summaryTitle: { padding: 6, width: '15%' },
  summaryValue: { padding: 6, width: '15%' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
});

export interface ReportPDFDocumentProps {
  type: string;
  dateRange: { from: string; to: string };
  data: {
    metrics: {
      title: string;
      subtitle: string;
      value: string;
      issues: {
        Id: string;
        Title: string;
        Status: string;
        Address: {
          AddressLine1: string;
          AddressLine2: string;
          Town: string;
          County: string;
          PostCode: string;
          Country: string;
        };
        internal: { keyDates: { jobCompleted: string }; capex: { data: { worksDueDate: string } } };
      }[];
    }[];
  };
}

function getMonthAndYear(date: string): string {
  if (!date) return '(none)';

  // Attempt to standardize the date format to something the Date object can understand better
  const standardizedDate = date.replace(/(\d+)(st|nd|rd|th)/, '$1'); // Remove ordinal suffix if present
  const dateObj = new Date(standardizedDate);

  if (isNaN(dateObj.getTime())) {
    // Return an error indication for unparseable dates
    return '(invalid date)';
  }

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const month = monthNames[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  return `${month} ${year}`;
}

export function ReportPDFDocument({ type, dateRange, data }: ReportPDFDocumentProps): React.JSX.Element {
  const pageNumber = 1;

  if (!data) return null;
  return (
    <Document>
      <Page size="A3" style={styles.page} wrap>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.flexGrow}>
            <Text style={[styles.textXl, styles.fontSemibold]}>
              REPORT - {dateRange.from ? getMonthAndYear(dateRange.from).toUpperCase() : 'NA'} - {type.toUpperCase()}
            </Text>
            <Text style={styles.textLg}>
              Data from {dateRange?.from || '(none)'} to {dateRange?.to || '(none)'}
            </Text>
          </View>
          <View>
            <Image source="/assets/logo-emblem--dark.png" style={styles.brand} />
          </View>
        </View>

        {/* Metrics Display */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {data.metrics.map((metric, index) => (
            <View
              key={index}
              style={{
                marginLeft: index === 0 ? 0 : 16,
                marginRight: index === data.metrics.length - 1 ? 0 : 16,
                maxWidth: '20%',
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: 'gray',
                paddingBottom: 2,
              }}
            >
              <Text style={{ color: 'black', fontSize: 18, textAlign: 'center', margin: 'auto' }}>{metric.title}</Text>
              <Text style={{ color: 'gray', fontSize: 12, textAlign: 'center', margin: 'auto' }}>
                {metric.subtitle}
              </Text>
              <Text style={{ fontSize: 24, textAlign: 'center', margin: 'auto' }}>{metric.value}</Text>
            </View>
          ))}
        </View>

        {/* Metrics and Issues */}
        {data.metrics.map((metric, index) => {
          if (metric.issues.length === 0) return null;

          return (
            <React.Fragment key={index}>
              <View style={{ marginBottom: 2 }}>
                <Text style={{ color: 'black', fontSize: 14 }}>
                  {metric.title} - {metric.subtitle}: {metric.value}
                </Text>
              </View>
              {/* Issues Table for Current Metric */}
              <View style={styles.items}>
                <View style={styles.itemRow}>
                  <Text style={styles.itemDescriptionShort}>ID</Text>
                  <Text style={styles.itemDescription}>Title</Text>
                  <Text style={styles.itemDescriptionShort}>Status</Text>
                  <Text style={styles.itemDescription}>Address</Text>
                  <Text style={styles.itemDescriptionShort}>Awarded Date</Text>
                  <Text style={styles.itemDescriptionShort}>Completion Date</Text>
                  <Text style={styles.itemDescriptionShort}>Move Out Date</Text>
                </View>

                {metric.issues?.map((issue) => {
                  const moveOutDate = displayDate(
                    issue.internal?.capex?.data?.actualMoveOutDate,
                    'Move out date not available'
                  );
                  const jobCompletedDate = displayDate(issue.internal?.keyDates?.jobCompleted, 'Job not completed');
                  const awardedDate = displayDate(issue.internal?.keyDates?.jobAwarded, 'Job has not been awarded');

                  return (
                    <View key={issue.Id} style={styles.itemRow}>
                      <Text style={styles.itemDescriptionShort}>{issue.Id}</Text>
                      <Text style={styles.itemDescription}>{issue.Title}</Text>
                      <Text style={styles.itemDescriptionShort}>
                        {issue.Status?.replace(/([a-z])([A-Z])/g, '$1 $2')}
                      </Text>
                      <Text style={styles.itemDescription}>
                        {formatAddress(issue.Address)}
                      </Text>
                      <Text style={styles.itemDescriptionShort}>{awardedDate}</Text>
                      <Text style={styles.itemDescriptionShort}>{jobCompletedDate}</Text>
                      <Text style={styles.itemDescriptionShort}>{moveOutDate}</Text>
                    </View>
                  );
                })}
              </View>
            </React.Fragment>
          );
        })}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>S3 TECHNOLOGIES</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `${dayjs().format('MMM D, YYYY h:mm A')} - Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}

// function getMonthName(date: string): string {
//   if (!date) return '(none)';

//   // Attempt to standardize the date format to something the Date object can understand better
//   const standardizedDate = date.replace(/(\d+)(st|nd|rd|th)/, '$1'); // Remove ordinal suffix if present
//   const dateObj = new Date(standardizedDate);

//   if (isNaN(dateObj.getTime())) {
//     // Return an error indication for unparseable dates
//     return '(invalid date)';
//   }

//   const monthNames = [
//     'January',
//     'February',
//     'March',
//     'April',
//     'May',
//     'June',
//     'July',
//     'August',
//     'September',
//     'October',
//     'November',
//     'December',
//   ];
//   return monthNames[dateObj.getMonth()];
// }
